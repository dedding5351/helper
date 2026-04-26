# Backend Architecture: FastAPI & Repository Pattern

This document outlines the architectural patterns and development standards for building scalable, maintainable, and testable backend services within this project.

## 1. Core Architecture: The Repository Pattern

Our backend relies on **FastAPI** and strictly follows the **Repository Pattern** combined with a **Service Layer**. This architectural approach decouples our application into distinct, focused layers. This ensures that changes in one area (e.g., swapping a database) do not ripple through the entire application.

The structure is divided into four main pillars, located within the `app/` directory:
1. **Models** (`app/models/`)
2. **Repositories** (`app/repositories/`)
3. **Services** (`app/services/`)
4. **Routes** (`app/routes/`)

---

## 2. Layer Definitions & Guidelines for Agents

When contributing to this codebase, you must adhere to the following responsibilities for each layer. **Do not bleed logic between layers.**

### A. Models (`app/models/`)
**Purpose:** Define the data structures and validation schemas.
- **What it is:** Pydantic `BaseModel` classes. These represent the shape of our data as it flows into the API, out of the API, and internally.
- **Rules for Agents:**
  - **No Business Logic:** Models must *never* contain business logic or database connections.
  - **Strict Typing:** Use strict type hints and Pydantic `Field` definitions to enforce validation (e.g., `Field(..., gt=0)`).
  - **Separation of Concerns:** Maintain separate models for database representations vs. request payloads (e.g., `Item`, `ItemCreate`, `ItemUpdate`).

### B. Repositories (`app/repositories/`)
**Purpose:** Handle all data access and persistence logic.
- **What it is:** Classes that abstract away the underlying database (e.g., ChromaDB, PostgreSQL, in-memory dicts).
- **Rules for Agents:**
  - **Data Access Only:** Repositories perform CRUD (Create, Read, Update, Delete) operations. They do *not* make business decisions.
  - **Input/Output:** They should accept and return Python dictionaries or Pydantic Models, never raw database cursors or HTTP request objects.
  - **Abstract the DB:** The rest of the application should not know *how* data is stored. If we change from ChromaDB to Pinecone, only the Repository layer should change.

### C. Services (`app/services/`)
**Purpose:** Contain the core business logic of the application.
- **What it is:** Classes that sit between the Routes and the Repositories. They coordinate workflows, enforce business rules, and transform data.
- **Rules for Agents:**
  - **The "Brain" of the App:** All complex logic (calculations, validations beyond type checking, calling multiple repositories) goes here.
  - **Framework Agnostic:** Services should know *nothing* about FastAPI. They should not import `HTTPException`, `Request`, or `Response`. If a business rule fails, raise a standard Python exception (e.g., `ValueError`) or a custom domain exception.
  - **Dependency Injection:** Services should accept their dependencies (like Repositories) via `__init__` or rely on a dependency injection framework, making them easily testable.

### D. Routes (`app/routes/`)
**Purpose:** Handle HTTP requests and responses.
- **What it is:** FastAPI `APIRouter` endpoints.
- **Rules for Agents:**
  - **Keep it Thin:** Routes should do almost nothing except receive the request, pass the data to a Service, and return the result.
  - **Error Handling:** Catch domain exceptions (e.g., `ValueError`) thrown by the Service and translate them into appropriate HTTP responses (e.g., `HTTPException(status_code=400)`).
  - **Dependency Injection:** Use FastAPI's `Depends()` to inject the required Service into the route handler.

---

## 3. How They Interact (The Flow)

When a request enters the system, it follows a strict one-way path:

1. **Client Request** → hits the **Route**.
2. **Route** validates the incoming JSON against a **Model** (e.g., `ItemCreate`).
3. **Route** passes the validated **Model** to the **Service**.
4. **Service** executes business logic. If it needs data, it calls the **Repository**.
5. **Repository** fetches/saves data to the Database and returns a **Model** to the **Service**.
6. **Service** finishes its logic and returns a **Model** back to the **Route**.
7. **Route** serializes the **Model** into JSON and sends the **Response**.

> [!IMPORTANT]
> **Strict Dependency Rule:** A layer can only call the layer directly below it. 
> - Routes → call Services.
> - Services → call Repositories.
> - **NEVER** call a Repository directly from a Route.
> - **NEVER** pass an HTTP Request object into a Service.

## 4. Dependency Injection Strategy at Scale

To wire these layers together cleanly and efficiently, we leverage FastAPI's native `Depends()` feature combined with a centralized **Dependencies Hub** (`app/core/dependencies.py`). 

This ensures that instantiation logic is isolated, avoiding tight coupling, and making it trivial to swap implementations (e.g., substituting a real database connection with a mock one during testing).

### The Injection Hierarchy:
1. **Database Connections:** We start by providing a database connection/session.
2. **Repositories:** Repositories are injected with the database connection.
3. **Services:** Services are injected with their required repositories.
4. **Routes:** Routes are injected with the fully constructed services.

### How to Implement Dependencies:

1. **Construct the Dependencies (`app/core/dependencies.py`):**
   ```python
   from fastapi import Depends
   from app.repositories.item_repository import ItemRepository
   from app.services.item_service import ItemService

   def get_db_connection():
       # Yield the DB session/connection (e.g., SQLAlchemy session)
       yield db

   def get_item_repository(db = Depends(get_db_connection)) -> ItemRepository:
       # Inject DB into Repository
       return ItemRepository(db=db)

   def get_item_service(repository: ItemRepository = Depends(get_item_repository)) -> ItemService:
       # Inject Repository into Service
       return ItemService(repository=repository)
   ```

2. **Use in the Route:**
   ```python
   from app.core.dependencies import get_item_service

   @router.get("/")
   def list_items(service: ItemService = Depends(get_item_service)):
       return service.list_items()
   ```

### Rules for Agents Regarding DI:
- **Never Instantiate directly:** A Route must *never* do `service = ItemService()`. A Service must *never* do `repo = ItemRepository()`.
- **Always use `__init__`:** Services and Repositories must declare their dependencies in their constructor (`__init__`).
- **Centralize:** All composition of dependencies using FastAPI's `Depends()` must live in `app/core/dependencies.py` to keep the Route files clean and focused solely on HTTP logic.

---

## 5. Development Standards

- **Type Hinting:** Python type hints are mandatory for all function signatures (arguments and return types).
- **FastAPI Features:** Leverage FastAPI's dependency injection system (`Depends()`) from the core dependencies hub for wiring Services into Routes.
- **Documentation:** Use docstrings for all Service methods and Repository methods. FastAPI will automatically generate Swagger UI docs from route docstrings and Pydantic models.
- **Testing:** Because of this architecture, Services and Repositories can be unit-tested in isolation by mocking their dependencies. Always write tests for Services without spinning up the FastAPI server by manually passing mock Repositories to the Service constructor.

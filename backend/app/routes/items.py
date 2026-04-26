from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.item import Item, ItemCreate
from app.services.item_service import ItemService
from app.core.dependencies import get_item_service

router = APIRouter(tags=["items"])

@router.get("/", response_model=List[Item])
def list_items(service: ItemService = Depends(get_item_service)):
    """Retrieve all items."""
    return service.list_items()

@router.get("/{item_id}", response_model=Item)
def get_item(item_id: str, service: ItemService = Depends(get_item_service)):
    """Retrieve an item by its ID."""
    item = service.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=Item, status_code=201)
def create_item(item_in: ItemCreate, service: ItemService = Depends(get_item_service)):
    """Create a new item."""
    try:
        return service.create_item(item_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

import styles from './page.module.css';
import { Button } from './components/Button/Button';
import { cn } from './lib/utils';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to the Modern Next.js App</h1>
      <p className={styles.description}>
        Built with Server Components, CSS Modules, and clean architecture.
      </p>

      <div className={styles.actions}>
        <Button variant="primary" size="lg">Get Started</Button>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
      
      <div className={styles.grid}>
        <a href="https://nextjs.org/docs" className={cn(styles.card)}>
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a href="https://nextjs.org/learn" className={cn(styles.card)}>
          <h2>Learn &rarr;</h2>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </a>
      </div>
    </main>
  );
}

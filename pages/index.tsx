import { useEffect, useState } from 'react';

export default function Home() {
  const [hello, setHello] = useState('');
  const [world, setWorld] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/hello').then(r => r.text()),
      fetch('/api/world').then(r => r.text())
    ]).then(([h, w]) => {
      setHello(h);
      setWorld(w);
    });
  }, []);

  return (
    <main>
      <h1>{hello}</h1>
      <h1>{world}</h1>
    </main>
  );
} 
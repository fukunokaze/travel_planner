import Link from "next/link";

export default function TripNotFound() {
  return (
    <main className="container py-5">
      <div className="alert alert-warning">
        Trip not found. Return to <Link href="/">My Trips</Link>.
      </div>
    </main>
  );
}


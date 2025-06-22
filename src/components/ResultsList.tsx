interface ResultsListProps {
  results: string[];
}

export default function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Generated Posts:</h2>
      <div className="space-y-4">
        {results.map((post, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <p>{post}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 
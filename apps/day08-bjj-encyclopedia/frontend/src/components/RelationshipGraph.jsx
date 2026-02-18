import { TechniqueCard } from "./TechniqueCard";

const RELATIONSHIP_LABELS = {
  leads_to: "From here, you can attack with…",
  defends_against: "This defends against…",
  escapes_from: "Escape routes from…",
  counters: "Countered by…",
};

function RelationshipGroup({ relationshipType, techniques }) {
  const label = RELATIONSHIP_LABELS[relationshipType] || relationshipType;
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {techniques.map((t) => (
          <TechniqueCard key={t.id} technique={t} compact />
        ))}
      </div>
    </div>
  );
}

export function RelationshipGraph({ outgoing, incoming }) {
  const outgoingByType = outgoing.reduce((acc, rel) => {
    const key = rel.relationship_type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rel.technique);
    return acc;
  }, {});

  const incomingByType = incoming.reduce((acc, rel) => {
    const key = rel.relationship_type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rel.technique);
    return acc;
  }, {});

  const hasOutgoing = outgoing.length > 0;
  const hasIncoming = incoming.length > 0;

  if (!hasOutgoing && !hasIncoming) {
    return (
      <p className="text-sm text-gray-400">No linked techniques for this entry.</p>
    );
  }

  return (
    <div className="space-y-8">
      {hasOutgoing && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-800">Related Techniques</h2>
          <div className="space-y-6">
            {Object.entries(outgoingByType).map(([type, techs]) => (
              <RelationshipGroup key={type} relationshipType={type} techniques={techs} />
            ))}
          </div>
        </section>
      )}

      {hasIncoming && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-800">Referenced By</h2>
          <div className="space-y-6">
            {Object.entries(incomingByType).map(([type, techs]) => (
              <RelationshipGroup key={type} relationshipType={type} techniques={techs} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function MutationHistory() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-[var(--bg-very-dark)] text-[var(--text-light-2)] rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-[var(--purple-glow)]">
        Our History
      </h1>

      <section className="mb-8 p-6 bg-[var(--black-background)] rounded">
        <h2 className="text-xl font-semibold mb-4 text-white">The Beginning</h2>
        <p className="text-gray-400 mb-4">
          Mutant School began as a small training outpost where gifted
          individuals gathered to learn how to control and refine their
          abilities. Founded by a coalition of scientists, educators, and
          veteran operatives, the school combined rigorous study with hands-on
          missions to help students turn raw power into purpose.
        </p>
      </section>

      <section className="mb-8 p-6 bg-[var(--black-background)] rounded">
        <h2 className="text-xl font-semibold mb-4 text-white">Early Years</h2>
        <p className="text-gray-400 mb-4">
          Early years were focused on discovery and safety: instructors mapped
          abilities, created containment and training protocols, and designed
          the first mission-based curricula. As the school grew, it became a hub
          for innovation — developing specialized modules for stealth,
          cybernetics, elemental manipulation, and team synergy.
        </p>
      </section>

      <section className="mb-8 p-6 bg-[var(--black-background)] rounded">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Key Milestones
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li>
            <strong className="text-white">Founding:</strong> Established as a
            research and training outpost to study emergent abilities
            responsibly.
          </li>
          <li>
            <strong className="text-white">First graduates:</strong> Early
            cohorts completed the mission track and were deployed as field
            operatives and community leaders.
          </li>
          <li>
            <strong className="text-white">Curriculum expansion:</strong> New
            modules introduced for leadership, ethics, and advanced
            tech-integration.
          </li>
          <li>
            <strong className="text-white">Community programs:</strong> Outreach
            and mentorship initiatives connected students with instructors,
            researchers, and allied organizations.
          </li>
          <li>
            <strong className="text-white">Modern era:</strong> A balanced focus
            on capability, accountability, and personal growth — with a robust
            mutation history system to track progress and changes.
          </li>
        </ul>
      </section>

      <section className="mb-8 p-6 bg-[var(--black-background)] rounded">
        <h2 className="text-xl font-semibold mb-4 text-white">Today</h2>
        <p className="text-gray-400">
          Today, Mutant School blends cutting-edge research, practical mission
          experience, and ethical training. Students graduate not only with
          enhanced abilities, but with the judgment to use them well. The
          Mutation History is part of that journey — a transparent log that
          helps learners and mentors understand how skills evolved, who approved
          changes, and why they matter.
        </p>
      </section>
    </div>
  );
}

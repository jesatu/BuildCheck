import { characterSkills, loresheets, occupationalSkills } from './data'

/** Placeholder page until the build editor exists (phase 4). */
export function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '2rem auto', padding: '0 16px' }}>
      <h1>BuildCheck</h1>
      <p>Plan and validate Lorien Trust character builds. The build editor is coming soon.</p>
      <p>
        Rules data loaded: {characterSkills.length} Character Skills, {occupationalSkills.length} Occupational
        Skills, {loresheets.length} loresheets.
      </p>
    </main>
  )
}

import React from 'react';
import { useRouletteContext } from './context/RouletteContext';

export function DebugApp() {
  // Hook deve ser chamado no topo, não dentro de try/catch
  const { state } = useRouletteContext();
  
  // Verificar se state existe
  if (!state) {
    return (
      <div style={{ color: 'red', padding: '2rem', background: '#0f0f23', minHeight: '100vh' }}>
        <h1>Error in Context</h1>
        <pre>State is undefined - Context not available</pre>
      </div>
    );
  }
  
  return (
    <div style={{ color: 'white', padding: '2rem', background: '#0f0f23', minHeight: '100vh' }}>
      <h1>Debug App</h1>
      <p>Projects: {state.projects?.length || 0}</p>
      <p>Active Project ID: {state.activeProjectId || 'none'}</p>
      <p>Participants: {state.participants?.length || 0}</p>
      <p>Tasks: {state.tasks?.length || 0}</p>
      <p>Global Teams: {state.globalTeams?.length || 0}</p>
      
      <h2>State</h2>
      <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

export default DebugApp;
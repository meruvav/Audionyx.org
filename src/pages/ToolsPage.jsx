import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ToolsDashboard from '../components/ToolsDashboard';
import { sections } from '../constants/site';

export default function ToolsPage({ tools }) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requestedTool = searchParams.get('tool');
    if (requestedTool && sections.some((section) => section.id === requestedTool)) {
      tools.setActive(requestedTool);
    }
  }, [searchParams, tools]);

  return <ToolsDashboard tools={tools} />;
}

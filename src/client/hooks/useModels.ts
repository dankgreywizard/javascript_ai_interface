import { useState, useEffect } from "react";

export function useModels(currentTab: string) {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('codellama:latest');

  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await fetch('/api/ollama/models');
        const data = await res.json();
        if (res.ok && Array.isArray(data?.models)) {
          setModels(data.models);
          // keep selected if still available, else default to codellama or first
          if (data.models.includes(selectedModel)) return;
          if (data.models.includes('codellama:latest')) setSelectedModel('codellama:latest');
          else if (data.models.length > 0) setSelectedModel(data.models[0]);
        }
      } catch (e) {
        // ignore, keep defaults
      }
    };
    if (currentTab === 'git') loadModels();
  }, [currentTab, selectedModel]);

  return { models, setModels, selectedModel, setSelectedModel };
}

import * as React from 'react';
import { IChecklistItem } from '../../interfaces/IChecklistItem';
import ChecklistItem from '../ChecklistItem/ChecklistItem';
import useChecklist from '../../hooks/useChecklist';
import { IChecklistUserItem } from '../../interfaces/IChecklistUserItem';
import { AppContext } from '../../context/AppContextProvider';

const Checklist: React.FC = () => {
  const { loadChecklist, getResponses } = useChecklist();

  const appContext = React.useContext(AppContext);

  React.useEffect(() => {
    const load: () => Promise<void> = async () => {
      await getResponses();
      await loadChecklist();
    }

    load()
      .then(() => console.log('Checklist loaded'))
      .catch((e: Error) => console.error(e.message));

  }, []);

  if (!appContext || appContext?.state.list.length === 0) return null;

  return (
    <>
      {appContext.state.list.map((item: IChecklistItem) => {
        const task: IChecklistUserItem | undefined = appContext.state.responses.find((r: IChecklistUserItem) => r.Task.Id === item.Id);

        return (
          <ChecklistItem
            key={item.Id}
            id={item.Id}
            taskId={task ? task.Id : 0}
            title={item.Title}
            description={item.Content}
            completed={task ? true : false}
          />
        );
      })}
    </>
  );
};

export default Checklist;

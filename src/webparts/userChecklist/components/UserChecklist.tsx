import * as React from 'react';
import styles from './UserChecklist.module.scss';
import { IUserChecklistProps } from './IUserChecklistProps';
import AppContextProvider from '../context/AppContextProvider';
import Message from './Message/Message';
import Checklist from './Checklist/Checklist';

const UserChecklist: React.FC<IUserChecklistProps> = ({
  title,
  description,
  checklist,
  progress,
  userId,
  context
}) => {
  return (
    <AppContextProvider context={context} src={checklist} userId={userId} tgt={progress}>
      <section className={styles.userChecklist}>
        <div className={styles.column}>
          <Message title={title} description={description} />
        </div>
        <div className={styles.column}>
          <Checklist />
        </div>
      </section>
    </AppContextProvider>
  );
};

export default UserChecklist;

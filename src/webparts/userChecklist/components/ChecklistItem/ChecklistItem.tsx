import * as React from 'react';
import {
  Checkbox,
  IconButton,
  IIconProps,
  Spinner,
  SpinnerSize,
  Stack,
  Text
} from 'office-ui-fabric-react';
import { IChecklistItemProps } from './IChecklistItemProps';
import styles from './ChecklistItem.module.scss';
import useChecklist from '../../hooks/useChecklist';

const ChecklistItem: React.FC<IChecklistItemProps> = ({
  id,
  title,
  taskId,
  description,
  completed
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<boolean>(completed);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { addResponse } = useChecklist();

  const collapseIcon: IIconProps = { iconName: 'ChevronDown' };
  const expandIcon: IIconProps = { iconName: 'ChevronUp' };

  const expand: () => void = React.useCallback(() => setExpanded(!expanded), [expanded]);
  
  const handleCheck: (ev: React.FormEvent<HTMLInputElement>, chk: boolean) => void = React.useCallback(async (ev, chk) => {
    setLoading(true);

    try {
      await addResponse(id, chk, taskId)
        .then(() => {
          setLoading(false);
          setChecked(chk);
        })
        .catch((e: Error) => {
          throw Error(e.message);
        });
    } catch (e) {
      console.error(e);

      setLoading(false);
    }
  }, [taskId]);

  return (
    <Stack
      style={{ width: '100%', display: 'flex' }}
      horizontalAlign='start'
      verticalAlign='start'
    >
      <Stack
        horizontal
        grow={1}
        tokens={{ childrenGap: 2 }}
        className={styles.checklistItem}
        verticalAlign='center'
        horizontalAlign='center'
      >
        <Stack horizontal verticalAlign='center' horizontalAlign='start'>
          {loading ?
          <Spinner size={SpinnerSize.large} className={styles.spinner} /> :
          <Checkbox
            checked={checked}
            className={styles.check}
            disabled={loading}
            styles={{ checkbox: styles.checkbox, checkmark: styles.checkmark }}
            onChange={handleCheck}
          />            
        }
          <Text as='h4' variant='mediumPlus' className={styles.checkLabel}>
            {title}
          </Text>
        </Stack>
        <IconButton
          iconProps={expanded ? expandIcon : collapseIcon}
          onClick={expand}
          styles={{ root: styles.icon }}
          title={expanded ? 'Collapse' : 'Expand'}
          color='neutralPrimary'
        />
      </Stack>
      {expanded && <div className={styles.content} dangerouslySetInnerHTML={{ __html: description }} />}
    </Stack>
  );
};

export default ChecklistItem;

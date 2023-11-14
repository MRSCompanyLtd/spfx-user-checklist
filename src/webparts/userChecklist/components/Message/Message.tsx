import * as React from 'react';
import { Text } from 'office-ui-fabric-react';
import { IMessageProps } from './IMessageProps';

const Message: React.FC<IMessageProps> = ({ title, description }) => {
    return (
        <>
          <Text as='h2' variant='xLargePlus'>
            {title}
          </Text>
          <Text as='h4' variant='large'>
            {description}
          </Text>
        </>
    );
}

export default Message;

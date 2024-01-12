import React from 'react';

const Chat = ({ descendingOrderMessages }) => {
  return (
    <div className="chat-display">
      {descendingOrderMessages.map((message, index) => (
        <div key={index} style={getStyle(message.isCurrentUser)}>
          <div className="chat-message-header">
            <div className="img-container" style={styles.imgContainer(message.isCurrentUser)}>
              <img src={message.img} alt={message.name + ' profile'} />
            </div>
            <p>{message.name}</p>
          </div>
          <div style={styles.messageBox(message.isCurrentUser)}>
            <p>{message.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const getStyle = (isCurrentUser) => {
  const baseStyle = {
    marginBottom: '0px',
  };

  if (isCurrentUser) {
    return {
      ...baseStyle,
      textAlign: 'right',
    };
  } else {
    return baseStyle;
  }
};

const styles = {
  imgContainer: (isCurrentUser) => ({
    float: isCurrentUser ? 'right' : 'left', 
    margin: isCurrentUser ? '0 0 0 10px' : '0 10px 0 0', 
  }),
  messageBox: (isCurrentUser) => ({
    padding: '10px',
    borderRadius: '80px',
    height: '20px',
    width: 'fit-content', // Fit với nội dung chiều ngang
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isCurrentUser ? 'linear-gradient(to right, #FE8E7D, #B7BBDF)' : 'rgba(211, 211, 211, 0.7)',
    color: isCurrentUser ? '#ffffff' : '#000000',
    marginLeft: isCurrentUser ? 'auto' : '0',
    marginRight: isCurrentUser ? '0' : 'auto',
  }),
};

export default Chat;

import { useCookies } from 'react-cookie'

const ChatHeader = ({ user }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)

        // Navigate back to Homepage
        //Updating "logged out" card
        window.location.href = '/'
    }

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.url} alt={"photo of " + user.first_name}/>
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <i
  className="log-out-icon"
  onClick={logout}
  style={{
    display: 'inline-block',
    fontSize: '24px', // Điều chỉnh kích thước của mũi tên
    transform: 'rotate(180deg)', // Quay mũi tên 180 độ để không bị in nghiêng
    cursor: 'pointer',
  }}
>
  &#x279C;
</i>
        </div>
    )
}

export default ChatHeader
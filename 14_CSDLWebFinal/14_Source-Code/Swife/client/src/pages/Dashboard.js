import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import Fireworks from '../components/Fireworks'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const containerStyle = {
        backgroundColor: '#F0F0F0'
      }
    const userId = cookies.UserId

    const [showSwipeInfo, setShowSwipeInfo] = useState(false);
    const [fireworksPosition, setFireworksPosition] = useState({ positionX: 0, positionY: 0 }); // Define fireworksPosition state

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: {
                    gender: user?.gender_interest,
                    smoking: user?.smoking_interest,
                    drinking: user?.drinking_interest
                }
                
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
            setShowSwipeInfo(true)
            setLastDirection('right')
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (showSwipeInfo) {
            const timer = setTimeout(() => {
                setShowSwipeInfo(false);
                setLastDirection('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showSwipeInfo]);


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
            setShowSwipeInfo(true);

            // Tính toán vị trí hiển thị pháo hoa xung quanh swipe
            const cardElement = document.querySelector('.swipe'); // Lấy phần tử card
            const rect = cardElement.getBoundingClientRect(); // Lấy thông tin vị trí của card
            const positionX = rect.x + rect.width / 2; // Tính toán vị trí X
            const positionY = rect.y + rect.height / 2; // Tính toán vị trí Y
      
            // Truyền vị trí cho Fireworks Component
            setFireworksPosition({ positionX, positionY });
      
            // Tắt hiệu ứng sau 2 giây
            setTimeout(() => {
              setShowSwipeInfo(false);
            }, 2000);
          }
          setLastDirection(direction);
        }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }
    
    const deg2rad = (deg) => deg * (Math.PI / 180);

    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))


    console.log('filteredGenderedUsers ', filteredGenderedUsers)
    return (
        <div style={containerStyle}>
            {user &&
            <div className="dashboard">
                <ChatContainer user={user}/>
                <div className="swipe-container">
                    <div className="card-container">
                        {filteredGenderedUsers?.map((genderedUser) =>
                            <TinderCard
                                className="swipe"
                                key={genderedUser.user_id}
                                onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                                <div
                                    style={{backgroundImage: "url(" + genderedUser.url + ")", position: 'relative'}}
                                    className="card">
                                    <div className = "info-board">
                                        <h3 style={{display: 'inline-block', marginLeft: '10px', marginTop: '5px', marginBottom: '-5px', fontWeight: 'bold', fontSize: '30px', background: '-webkit-linear-gradient(right, #ce672f, #fe7d9b', WebkitBackgroundClip: 'text', color: 'transparent'}}>{genderedUser.first_name} {genderedUser.last_name}</h3>
                                        <h3 style={{display: 'inline-block', marginLeft: '5px', marginTop: '5px', marginBottom: '-5px', fontSize: '20px'}}>
                                            {(() => {
                                                const dob = new Date(genderedUser.dob_year, genderedUser.dob_month - 1, genderedUser.dob_day);
                                                const ageDiffMs = Date.now() - dob.getTime();
                                                const ageDate = new Date(ageDiffMs);
                                                return Math.abs(ageDate.getUTCFullYear() - 1970); // 
                                            })()}
                                        </h3>
                                        <h3 style={{ marginLeft: '10px', marginBottom: '5px', fontSize: '17px' }}>{genderedUser.about}</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '10px' }}>
                                        {genderedUser.hobbies.map((hobby, index) => (
                                            <div key={index} style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            padding: '5px',
                                            marginTop: '8px',
                                            marginRight: '5px',
                                            marginBottom: '-3px',
                                            background: 'linear-gradient(45deg, #ce672f, #575ec2)'
                                            }}>
                                            <h3 style={{
                                                margin: '0',
                                                fontSize: 'smaller', 
                                                color: '#fff', 
                                                padding: '5px',
                                                borderRadius: '5px' 
                                            }}>{hobby}</h3>
                                            </div>
                                        ))}
                                        </div>


                                        <h3 style={{ marginLeft: '10px', marginBottom: '10px', }}>
                                        <span style={{
                                            background: 'linear-gradient(to right, #ce672f, #fe7d9b)',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                            display: 'inline-block'
                                        }}>
                                            {(() => {
                                            const R = 6371; // Radius of the Earth in kilometers
                                            const dLat = deg2rad(genderedUser.latitude - user.latitude);
                                            const dLon = deg2rad(genderedUser.longitude - user.longitude);

                                            const a =
                                                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                                Math.cos(deg2rad(user.latitude)) * Math.cos(deg2rad(genderedUser.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

                                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                            const distance = R * c; // Distance in kilometers

                                            return distance.toFixed(2); // Adjust as needed, rounding to two decimal places
                                            })()}
                                        </span> km away
                                        </h3>

                                    </div>
                                </div>

                            </TinderCard>
                        )}
                        {/* Hiển thị hiệu ứng pháo hoa khi swipe right */}
                        {showSwipeInfo && <Fireworks positionX={fireworksPosition.positionX} positionY={fireworksPosition.positionY} />}
                        {/* Thông báo "You swiped right" */}
                        <div className="swipe-info">
                            {lastDirection && (
                            <p>You swiped {lastDirection}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
export default Dashboard
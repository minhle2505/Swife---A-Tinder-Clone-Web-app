import Nav from '../components/Nav'
import {useState} from 'react'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const OnBoarding = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        last_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        smoking_identity: "no",
        smoking_interest: "no",
        drinking_identity: "no",
        drinking_interest: "no",
        hobbies: [],
        url: "",
        about: "",
        matches: []
    })

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()
        try {
            const response = await axios.put('http://localhost:8000/user', {formData})
            console.log(response)
            const success = response.status === 200
            if (success) navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }

    }

    const handleChange = (e) => {
        console.log('e', e);
    
        const { name, value, checked } = e.target;
    
        // Helper function to ensure a value is within a specific range
        const isInRange = (value, min, max) => {
            return value >= min && value <= max;
        };
    
        // Helper function to validate and update the state for date, month, and year
        const updateDateField = (fieldName, min, max) => {
            const parsedValue = parseInt(value, 10);
            const isValid = !isNaN(parsedValue) && isInRange(parsedValue, min, max);
    
            if (isValid) {
                setFormData((prevState) => ({
                    ...prevState,
                    [fieldName]: parsedValue,
                }));
            }
        };
    
        if (name === "hobbies") {
            const updatedHobbies = checked
                ? formData.hobbies.length < 5
                    ? [...formData.hobbies, value]
                    : formData.hobbies
                : formData.hobbies.filter((hobby) => hobby !== value);
    
            setFormData((prevState) => ({
                ...prevState,
                hobbies: updatedHobbies,
            }));
        } else if (["dob_day", "dob_month", "dob_year"].includes(name)) {
            switch (name) {
                case "dob_day":
                    updateDateField(name, 1, 31);
                    break;
    
                case "dob_month":
                    updateDateField(name, 1, 12);
                    break;
    
                case "dob_year":
                    updateDateField(name, 1, 2024);
                    break;
    
                default:
                    break;
            }
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />

            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            id="last_name"
                            type='text'
                            name="last_name"
                            placeholder="Last Name"
                            required={true}
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Man</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={handleChange}
                                checked={formData.gender_identity === "more"}
                            />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        {/* <label htmlFor="show-gender">Show Gender on my Profile</label>

                        <input
                            id="show-gender"
                            type="checkbox"
                            name="show_gender"
                            onChange={handleChange}
                            checked={formData.show_gender}
                        /> */}

                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_interest === "man"}
                            />
                            <label htmlFor="man-gender-interest">Man</label>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_interest === "woman"}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData.gender_interest === "everyone"}
                            />
                            <label htmlFor="everyone-gender-interest">Everyone</label>

                        </div>
                        <label>Smoking</label>
                        <div className="multiple-input-container">
                            <input
                                id="yes-smoking-identity"
                                type="radio"
                                name="smoking_identity"
                                value="yes"
                                onChange={handleChange}
                                checked={formData.smoking_identity === "yes"}
                            />
                            <label htmlFor="yes-smoking-identity">Yes</label>
                            <input
                                id="no-smoking-identity"
                                type="radio"
                                name="smoking_identity"
                                value="no"
                                onChange={handleChange}
                                checked={formData.smoking_identity === "no"}
                            />
                            <label htmlFor="no-smoking-identity">No</label>
                        </div>

                        <label>Show me people who smokes?</label>

                        <div className="multiple-input-container">
                            <input
                                id="yes-smoking-interest"
                                type="radio"
                                name="smoking_interest"
                                value="yes"
                                onChange={handleChange}
                                checked={formData.smoking_interest === "yes"}
                            />
                            <label htmlFor="yes-smoking-interest">Yes</label>
                            <input
                                id="no-smoking-interest"
                                type="radio"
                                name="smoking_interest"
                                value="no"
                                onChange={handleChange}
                                checked={formData.smoking_interest === "no"}
                            />
                            <label htmlFor="no-smoking-interest">No</label>
                        </div>

                        <label>Drinking</label>
                        <div className="multiple-input-container">
                            <input
                                id="yes-drinking-identity"
                                type="radio"
                                name="drinking_identity"
                                value="yes"
                                onChange={handleChange}
                                checked={formData.drinking_identity === "yes"}
                            />
                            <label htmlFor="yes-drinking-identity">Yes</label>
                            <input
                                id="no-drinking-identity"
                                type="radio"
                                name="drinking_identity"
                                value="no"
                                onChange={handleChange}
                                checked={formData.drinking_identity === "no"}
                            />
                            <label htmlFor="no-drinking-identity">No</label>
                        </div>

                        <label>Show me people who drinks?</label>

                        <div className="multiple-input-container">
                            <input
                                id="yes-drinking-interest"
                                type="radio"
                                name="drinking_interest"
                                value="yes"
                                onChange={handleChange}
                                checked={formData.drinking_interest === "yes"}
                            />
                            <label htmlFor="yes-drinking-interest">Yes</label>
                            <input
                                id="no-drinking-interest"
                                type="radio"
                                name="drinking_interest"
                                value="no"
                                onChange={handleChange}
                                checked={formData.drinking_interest === "no"}
                            />
                            <label htmlFor="no-drinking-interest">No</label>
                        </div>

                        <label>Hobbies (maximum 5)</label>
                        <div className="multiple-input-container hobbies-container">
                            <label>
                                <input
                                    id="dog-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="dog"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("dog")}
                                />
                                Dog
                            </label>
                            <label>
                                <input
                                    id="cat-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="cat"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("cat")}
                                />
                                Cat
                            </label>
                            <label>
                                <input
                                    id="mouse-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="mouse"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("mouse")}
                                />
                                Mouse
                            </label>
                            <label>
                                <input
                                    id="gaming-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="gaming"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("gaming")}
                                />
                                Gaming
                            </label>
                            <label>
                                <input
                                    id="reading-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="reading"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("reading")}
                                />
                                Reading
                            </label>
                            <label>
                                <input
                                    id="coding-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="coding"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("coding")}
                                />
                                Coding
                            </label>
                            <label>
                                <input
                                    id="traveling-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="traveling"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("traveling")}
                                />
                                Traveling
                            </label>
                            <label>
                                <input
                                    id="cooking-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="cooking"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("cooking")}
                                />
                                Cooking
                            </label>
                            <label>
                                <input
                                    id="photography-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="photography"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("photography")}
                                />
                                Photography
                            </label>
                            <label>
                                <input
                                    id="music-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="music"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("music")}
                                />
                                Music
                            </label>
                            <label>
                                <input
                                    id="painting-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="painting"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("painting")}
                                />
                                Painting
                            </label>
                            <label>
                                <input
                                    id="sports-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="sports"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("sports")}
                                />
                                Sports
                            </label>
                            <label>
                                <input
                                    id="writing-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="writing"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("writing")}
                                />
                                Writing
                            </label>
                            <label>
                                <input
                                    id="dancing-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="dancing"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("dancing")}
                                />
                                Dancing
                            </label>
                            <label>
                                <input
                                    id="yoga-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="yoga"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("yoga")}
                                />
                                Yoga
                            </label>
                            <label>
                                <input
                                    id="gardening-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="gardening"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("gardening")}
                                />
                                Gardening
                            </label>
                            <label>
                                <input
                                    id="volunteering-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="volunteering"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("volunteering")}
                                />
                                Volunteering
                            </label>
                            <label>
                                <input
                                    id="technology-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="technology"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("technology")}
                                />
                                Technology
                            </label>
                            <label>
                                <input
                                    id="fashion-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="fashion"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("fashion")}
                                />
                                Fashion
                            </label>
                            <label>
                                <input
                                    id="camping-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="camping"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("camping")}
                                />
                                Camping
                            </label>
                            <label>
                                <input
                                    id="movies-hobbie"
                                    type="checkbox"
                                    name="hobbies"
                                    value="movies"
                                    onChange={handleChange}
                                    checked={formData.hobbies.includes("movies")}
                                />
                                Movies
                            </label>
                            {/* Add more checkboxes for other hobbies as needed */}
                        </div>



                        <label htmlFor="about">About me</label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I like long walks..."
                            value={formData.about}
                            onChange={handleChange}
                        />

                        <input type="submit"/>
                    </section>

                    <section>

                        <label htmlFor="url">Profile Photo</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="profile pic preview"/>}
                        </div>


                    </section>

                </form>
            </div>
        </>
    )
}
export default OnBoarding
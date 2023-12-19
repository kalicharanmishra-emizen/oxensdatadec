import Image from 'next/image'
import styles from "../../styles/my-order.module.css";
import track1 from '../../public/images/track1.svg';
import track2 from '../../public/images/track2.svg';
import track3 from '../../public/images/track3.svg';
import track4 from '../../public/images/track4.svg';
import track_1 from '../../public/images/track_1.svg';
import track_2 from '../../public/images/track_2.svg';
import track_3 from '../../public/images/track_3.svg';
import track_4 from '../../public/images/track_4.svg';
const statusTrack = ({type,status,driver}) => {
  return (
    <ul>
        <li 
            className={
                (status >=2 && status<=6)?
                    "active full-track"
                :
                    (status==1 && status<=6)?
                        "active half-track"
                    :
                        ""
            }
        >
            <span role="button">
            <span className={`${styles.topTitle}`}>Food is prepairing</span>
            <span className={`${styles.iconTrack} iconTrackBlock`}>
                <Image src={track1} alt="Icon" className={`${styles.default} default`} />
                <Image src={track_1} alt="Icon" className={`${styles.hover} hoverImg`} />
            </span>
            <p>Waiting restaurant accept order</p>
            </span>
        </li>
        <li 
            className={
                (status > 3 && status <= 6)?
                    "active full-track"
                :
                    (status==3 && status <= 6)?
                        "active half-track"
                    :status==2?
                        "active"
                    :
                        ""
            }
        >
            {
                driver.status?
                    <span className={`${styles.driverConnect}`}>
                        <div className={`${styles.imgBlock}`}>
                            <img src={driver.detail.image} alt={driver.detail.name} />
                        </div>
                        <h6>{driver.detail.name}</h6>
                        <a href={`tel:${driver.detail.phone_no}`}>{driver.detail.phone_no}</a>
                    </span>
                :
                null
            } 
            <span role="button">
                <span className={`${styles.topTitle}`}>Picked up</span>
                <span className={`${styles.iconTrack} iconTrackBlock`}>
                    <Image src={track2} alt="Icon" className={`${styles.default} default`} />
                    <Image src={track_2} alt="Icon" className={`${styles.hover} hoverImg`} />
                </span>
                <p>Food ready pick up</p>
            </span>
        </li>
        {
            type==0?
                <li 
                    className={
                        (status > 5 && status <= 6)?
                            "active full-track"
                        :
                            (status==5 && status <= 6)?
                                "active half-track"
                            :status==4?
                                "active"
                            :
                                ""
                    }
                >
                <span role="button">
                    <span className={`${styles.topTitle}`}>Driver arrived</span>
                    <span className={`${styles.iconTrack} iconTrackBlock`}>
                        <Image src={track3} alt="Icon" className={`${styles.default} default`} />
                        <Image src={track_3} alt="Icon" className={`${styles.hover} hoverImg`} />
                    </span>
                    <p>Driver on his way</p>
                </span>
                </li>
            :
                null
        }
        
        <li
            className={status==6? "active":""}
        >
        <span role="button">
            <span className={`${styles.iconTrack} iconTrackBlock`}>
                <Image src={track4} alt="Icon" className={`${styles.default} default`} />
                <Image src={track_4} alt="Icon" className={`${styles.hover} hoverImg`} />
            </span>
            <p>Delivered</p>
        </span>
        </li>
    </ul>
  )
}

export default statusTrack
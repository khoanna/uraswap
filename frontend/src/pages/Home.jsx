import React from 'react'
import styles from "../style";
import { Hero, Billing, Business, CardDeal,  CTA, Stats } from "../components";


const Home = () => {
    return (
        <div>
            <div className={`bg-primary ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                    <Hero />
                </div>
            </div>
            <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                    <Stats />
                    <Business />
                    <Billing />
                    <CardDeal />
                    <CTA />
                </div>
            </div>
        </div>

    )
}

export default Home
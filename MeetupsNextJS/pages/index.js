import Head from 'next/head';
import { Fragment } from 'react';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>Meetups</title>
                <meta name="description" content="List of meetups." />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

export async function getStaticProps() {
    const client  = await MongoClient.connect('mongodb+srv://<username>:<password>@cluster0.ut3vydc.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup =>  ({
                title: meetup.data.title,
                address: meetup.data.address,
                image: meetup.data.image,
                id: meetup._id.toString(),
            }))
        },
        revalidate: 10
    };
}

export default HomePage;
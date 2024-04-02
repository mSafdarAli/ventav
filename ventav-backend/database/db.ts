import { Db, MongoClient } from "mongodb";
import config from "../config/config";
export const Database: {
	client?: MongoClient,
	db?: Db
} = {}

export async function connectToDatabase() {
	// const user = (config.db.username || config.db.password) ? `${config.db.username}:${config.db.password}@` : '';
	const client: MongoClient = new MongoClient(config.db.DB_CONN_STRING);

	await client.connect();

	const db: Db = client.db(config.db.database);
	if(db){
		console.log('connect')
	}
	Database.client = client;
	Database.db = db;
	return db;
}


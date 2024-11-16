/* eslint-disable node/prefer-global/process */
import * as dotenv from 'dotenv';

dotenv.config({ path: 'db.env' });

const env = process.env;

export default env;

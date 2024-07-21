import connection from "../config/db";
import { Data } from "../models/data.model";

const getDataService = async (created_by: number): Promise<Data[] | null> => {
    const [rows] = await (await connection).execute('SELECT * FROM movements WHERE created_by = ?', [created_by]);
    const data = rows as Data[];
    return data.length > 0 ? data : [];
};

export default getDataService;
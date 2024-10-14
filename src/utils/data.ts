// fetches sanity data

export const userQuery = (userId: string): string => {
    const query = `*[_type == 'user' && _id == '${userId}']`;
    return query;
}
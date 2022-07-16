  Moralis.Cloud.define("artistPhoto", async (request) => {
  
    const Users = await Moralis.Object.extend("_User");

    const query = new Moralis.Query(Users);
    const data = await query.find({ useMasterKey: true });

    return data
  })
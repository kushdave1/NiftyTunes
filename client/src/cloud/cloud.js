  Moralis.Cloud.define("artistPhoto", async (request) => {
  
    const Users = await Moralis.Object.extend("_User");

    const query = new Moralis.Query(Users);
    const data = await query.find({ useMasterKey: true });

    return data
  })

  Moralis.Cloud.define("bulkDelete", async (request) => {
    const LiveNFTs = await Moralis.Object.extend("LiveNFTs")
    const query = new Moralis.Query(LiveNFTs)


    const data = await query.find({useMasterKey: true})

  })
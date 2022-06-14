
// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
// import "hardhat/console.sol";


// contract LazyFactory is
//     ERC721URIStorage,
//     EIP712,
//     AccessControl,
//     ReentrancyGuard
// {

//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenId;

//     address payable theMarketPlace;
//     address payable theArtist;
//     uint256 nftyFee = 7;
//     string private constant SIGNING_DOMAIN_NAME = "NFTY";
//     string private constant SIGNING_DOMAIN_VERSION = "1";
//     bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
//     bytes32 constant VOUCHER_TYPEHASH =
//         keccak256(
//             "Voucher(uint256 artworkId,string title,uint256 priceWei,string tokenUri,string content,uint256 royalty)"
//         );

//     mapping(address => uint256) private balanceByAddress;


//     struct Voucher {
//         uint256 artworkId;
//         string title;
//         uint256 priceWei;
//         string tokenUri;
//         string content;
//         uint256 royalty;
//         bytes signature;
//     }

//     event RedeemedAndMinted(uint256 indexed tokenId);

    

//     constructor(
//         address payable marketplaceAddress,
//         string memory name,
//         string memory symbol,
//         address payable artist
//     ) ERC721("NftyTunes Tokens", "NFTY") EIP712(SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION) {
//         _setupRole(SIGNER_ROLE, artist);
//         theMarketPlace = marketplaceAddress;
//         theArtist = artist;
//     }

//     function redeem(
//         address buyer,
//         Voucher calldata voucher,
//         address signer
//     ) public payable nonReentrant {
//         address artist = signer;
//         require(msg.value == voucher.priceWei, "Enter the correct price");
//         require(artist != buyer, "You can not purchase your own token");
//         require(hasRole(SIGNER_ROLE, artist), "Invalid Signature");

//         // _mint(artist, voucher.artworkId);
//         // _setTokenURI(voucher.artworkId, voucher.tokenUri);
//         setApprovalForAll(theMarketPlace, true); // sender approves Market Place to transfer tokens
//         // transfer the token to the buyer
//         // _transfer(artist, buyer, voucher.artworkId);

//         NFTMarketplace nftMarketplace = NFTMarketplace(theMarketPlace);

//         uint256 amount = msg.value;
//         nftMarketplace.createOwnedToken(address(this), voucher.tokenUri, amount, voucher.artworkId, voucher.royalty, signer, msg.sender);

//         payable(artist).transfer(amount - (amount * nftyFee / 100));
//         payable(theMarketPlace).transfer(amount * nftyFee / 100);

//         emit RedeemedAndMinted(voucher.artworkId);
//     }



//     function getChainID() external view returns (uint256) {
//         uint256 id;
//         // https://docs.soliditylang.org/en/v0.8.7/yul.html?highlight=chainid#evm-dialect
//         assembly {
//             id := chainid()
//         }
//         return id;
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         virtual
//         override(AccessControl, ERC721)
//         returns (bool)
//     {
//         return
//             ERC721.supportsInterface(interfaceId) ||
//             AccessControl.supportsInterface(interfaceId);
//     }
// }


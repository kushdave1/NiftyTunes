// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.3;

// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
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
//     uint256 nftyFee = 0.001 ether;
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
//         address signer,
//         uint256 royalty
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

//         NFTMarketplace n = NFTMarketplace(theMarketPlace);

        


//         uint256 amount = msg.value;
//         n.createOwnedToken(address(this), voucher.tokenURI, amount, voucher.artworkId, voucher.royalty, signer);

//         payable(artist).transfer(amount - nftyFee);
//         payable(theMarketPlace).transfer(nftyFee);



//         emit RedeemedAndMinted(voucher.artworkId);
//     }

//     // function _hash(Voucher calldata voucher) internal view returns (bytes32) {
        
//     //     return
//     //         // _hashTypedDataV4(bytes32 structHash) → bytes32
//     //         _hashTypedDataV4(
//     //             keccak256(
//     //                 abi.encode(
//     //                     VOUCHER_TYPEHASH,
//     //                     voucher.artworkId,
//     //                     keccak256(bytes(voucher.title)),
//     //                     voucher.priceWei,
//     //                     keccak256(bytes(voucher.tokenUri)),
//     //                     keccak256(bytes(voucher.content))
                        
//     //                 )
//     //             )
//     //         );
//     // }

//     // // returns signer address
//     // function _verify(Voucher calldata voucher) internal view returns (address) {
//     //     bytes32 digest = _hash(voucher);

//     //     return ECDSA.recover(digest, voucher.signature);
//     // }

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
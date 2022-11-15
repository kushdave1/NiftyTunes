//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "OpenZeppelin/openzeppelin-contracts-upgradeable@4.8.0/contracts/access/OwnableUpgradeable.sol";
import "OpenZeppelin/openzeppelin-contracts-upgradeable@4.8.0/contracts/proxy/utils/Initializable.sol";

import "OpenZeppelin/openzeppelin-contracts-upgradeable@4.8.0/contracts/token/ERC1155/ERC1155Upgradeable.sol";
import "OpenZeppelin/openzeppelin-contracts-upgradeable@4.8.0/contracts/token/common/ERC2981Upgradeable.sol";

import { DefaultOperatorFiltererUpgradeable } from "./OpenSeaOperatorFilter/upgradeable/DefaultOperatorFiltererUpgradeable.sol";

contract LiveMintFactory is Initializable, ERC1155Upgradeable, ERC2981Upgradeable, OwnableUpgradeable, DefaultOperatorFiltererUpgradeable {

    bytes4 private constant _METADATA_ERC2981 = 0x0e89341c;

    string public name;
    string public symbol;

    mapping (uint256 => string) private _tokenURIs;
    
    function initialize(
        string memory name_,
        string memory symbol_,
        string memory defaultUri_,
        address royaltyReceiver_,
        uint96 royaltyFeeNumerator_
    ) public initializer {
        
        __ERC1155_init(defaultUri_);
        
        _setDefaultRoyalty(royaltyReceiver_, royaltyFeeNumerator_);
        
        name = name_;
        symbol = symbol_; 
    }

     function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, ERC2981Upgradeable)
        returns (bool)
    {
        return
            ERC1155Upgradeable.supportsInterface(interfaceId) ||
            ERC2981Upgradeable.supportsInterface(interfaceId) ||
            interfaceId == _METADATA_ERC2981 ||
            interfaceId == this.supportsInterface.selector;
    }

    function mint(address receiver, uint tokenId) public onlyOwner {
      _mint(receiver, tokenId, 1, bytes(""));
    }

    function mintBatch(address receiver, uint[] calldata tokenIds, uint[] calldata amts) public onlyOwner {
      _mintBatch(receiver, tokenIds, amts, bytes(""));
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
      _setTokenURI(tokenId, _tokenURI);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    // Maintain ERC721-style tokenURI method for marketplaces that want it
    function tokenURI(uint256 tokenId) public view returns (string memory) {
          return uri(tokenId);
    }
    
    function uri(uint256 id) public view override returns (string memory) {
      if (bytes(_tokenURIs[id]).length > 0){
        return _tokenURIs[id];
      } else {
        return super.uri(id);
      }
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes memory data)
    public
    override
    onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override onlyAllowedOperator(from) {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

}











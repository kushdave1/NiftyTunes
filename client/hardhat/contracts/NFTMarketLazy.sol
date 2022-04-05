//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract MarketPlace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _marketItemId;
    Counters.Counter private _marketItemSold;

    struct MarketItem {
        uint256 marketItemId;
        address lazyFactoryAddress;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    struct Token {
        uint256 tokenId;
        address[] tokenPayeeList;
    }

    mapping(uint256 => MarketItem) private marketItemById;
    mapping(uint256 => Token) private tokenById;
    mapping(uint256 => bool) private tokenMintedById;
    mapping(address => uint256) private balanceByAddress;

    uint256[] tokenIdList;

    event MarketItemCreated(
        uint256 indexed marketItemId,
        address lazyFactoryAddress,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 indexed price,
        bool sold
    );

    event MarketItemPurchased(
        uint256 indexed marketItemId,
        address indexed lazyFactoryAddress,
        uint256 indexed tokenId,
        address owner,
        uint256 price
    );

    event received(address, uint256);
    event fallingBack(string);

    address payable deployerAddress;

    constructor() {
        deployerAddress = payable(msg.sender);
    }

    // When listig an item for the first time seller sign it. Buyer mints and transferes it.
    // After token is minted it should be added to market place to be traded furthur.
    function createMarketSell(
        address lazyFactoryAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price can't be 0 wei");

        _marketItemId.increment();
        uint256 marketItemId = _marketItemId.current();

        marketItemById[marketItemId].marketItemId = marketItemId;
        marketItemById[marketItemId].lazyFactoryAddress = lazyFactoryAddress;
        marketItemById[marketItemId].tokenId = tokenId;
        marketItemById[marketItemId].price = price;
        marketItemById[marketItemId].seller = payable(msg.sender);
        marketItemById[marketItemId].owner = payable(address(0));
        marketItemById[marketItemId].sold = false;

        // give the ownership of the token to Market Place
        IERC721(lazyFactoryAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );
        emit MarketItemCreated(
            marketItemId,
            lazyFactoryAddress,
            tokenId,
            msg.sender, // seller
            address(0), // owner
            price,
            false
        );
    }

    // purchase the already minted token
    function purchaseMarketItem(
        address lazyFactoryAddress,
        uint256 marketItemId,
        uint256 vadeeFee
    ) public payable nonReentrant {
        uint256 price = marketItemById[marketItemId].price;
        require(msg.value == price, "Enter the artwork selling Price");
        uint256 tokenId = marketItemById[marketItemId].tokenId;

        uint256 amount = msg.value;
        // pay seller
        marketItemById[marketItemId].seller.transfer(amount - vadeeFee);
        IERC721(lazyFactoryAddress).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        marketItemById[marketItemId].owner = payable(msg.sender);
        marketItemById[marketItemId].sold = true;
        _marketItemSold.increment();

        // pay Vadee
        payable(deployerAddress).transfer(vadeeFee);

        emit MarketItemPurchased(
            marketItemId,
            lazyFactoryAddress,
            tokenId,
            msg.sender, // buyer
            price
        );
    }

    // list of all market items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _marketItemId.current();
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            MarketItem storage item = marketItemById[i + 1];
            items[i] = item;
        }
        return items;
    }

    function fetchCurrentId() public view returns (uint256) {
        return _marketItemId.current();
    }

    function fetchSoldId() public view returns (uint256) {
        return _marketItemSold.current();
    }

    // to receive eth
    receive() external payable {
        emit received(msg.sender, msg.value);
    }

    function withdraw() public {
        require(msg.sender == deployerAddress, "Only deployer can withdraw :)");
        address payable receiver = payable(msg.sender);

        uint256 balance = address(this).balance;
        receiver.transfer(balance);
    }

    function fetchMarketBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
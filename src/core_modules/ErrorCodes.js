
module.exports = {
    "LoadFailed": {id: 1, name: "LoadFailed", message: "Data container is empty!"},
    "ItemNotFound": {id: 2, name: "ItemNotFound", message: "Item does not exist!"},
    "CurrencyNotFound": {id: 3, name: "CurrencyNotFound", message: "Currency does not exist!"},
    "BundleNotFound": {id: 4, name: "BundleNotFound", message: "Bundle does not exist!"},
    "WalletNotFound": {id: 5, name: "WalletNotFound", message: "No wallet data stored!"},
    "InventoryNotFound": {id: 6, name: "InventoryNotFound", message: "No inventory data stored!"},
    "NotEnoughCurrency": {id: 7, name: "NotEnoughCurrency", message: "Not enough balance for currency!"},
    "ItemAmountToLow": {
            id: 8,
            name: "ItemAmountToLow",
            message: "Could not remove item as amount is too low!"
        },
    "CurrencyOperation": {id: 9, name: "CurrencyOperation", message: "Error updating wallet!"},
    "ItemOperation": {id: 10, name: "ItemOperation", message: "Error updating item to player inventory!"},
    "BundleOperation": {
            id: 11,
            name: "BundleOperation",
            message: "Error adding bundle to player inventory!"
        },
    "PublicGameStateOperation": {
            id: 12,
            name: "UserIdMissing",
            message: "Error adding public game state data! An custom user id must" +
                     " be set in order to save public game state data"
        },
    "GameStateServerError": {
            id: 13,
            name: "OtherUsersGameStateError",
            message: "Error when loading provided user id's game states from the server"
        },
    "DailyBonusServerError": {
            id: 14,
            name: "DailyBonusServerError",
            message: "Error processing the reward from daily bonus"
        },
    "DailyBonusLoadError": {
            id: 15,
            name: "DailyBonusLoadError",
            message: "Error loading the daily bonus page"
        },
    "SplashScreenLoadError": {
        id: 16,
        name: "SplashScreenLoadError",
        message: "Error loading the splash screen"
    }
};

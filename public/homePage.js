'use strict'
const logoutButton = new LogoutButton();

logoutButton.action = logoutButton.logoutClick = () => {
	ApiConnector.logout(response => {
		if (response.success == true) {
			location.reload();
		}
	});
}

ApiConnector.current(response => {
	if (response.success == true) {
		ProfileWidget.showProfile(response.data)
	}
});

const board = new RatesBoard();

function fillRatesBoard() {
	ApiConnector.getStocks(response => {
		if (response.success == true) {
			board.clearTable();
			board.fillTable(response.data);
		}
	});
}
fillRatesBoard();
setInterval(fillRatesBoard, 60000);  // <--Это, вместо этого-->  setInterval(() => fillRatesBoard(), 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = moneyManager.addMoneyAction = data => {
	ApiConnector.addMoney(data, response => {
		let amount = data.amount;
		let currency = data.currency;
		// console.log(amount, currency);
		console.log(response);
		// (response.success == true) 
		if (!amount && !currency) {
			moneyManager.setMessage(false, "Укажите сумму и валюту пополнения!");
		} else if (!currency) {
			moneyManager.setMessage(false, "Не указана валюта для пополнения!");
		} else if (!amount) {
			moneyManager.setMessage(false, "Не указана сумма для пополнения!");
		} else if (amount <= 0) {
			moneyManager.setMessage(false, "Сумма пополнения должна быть больше НУЛЯ! Попробуйте ещё раз.");
		} else if (response.success == true) { //
			moneyManager.setMessage(true, "Счёт успешно пополнен");
			ProfileWidget.showProfile(response.data);
		} else {
			moneyManager.setMessage(false, "Ошибка при пополнении! Попробуйте ещё раз.");
		}
	});
}

moneyManager.conversionMoneyCallback = moneyManager.conversionMoneyAction = data => {
	ApiConnector.convertMoney(data, response => {
		if (response.success == true) {
			moneyManager.setMessage(true, "Конвертация успешно исполнена");
			ProfileWidget.showProfile(response.data);
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
}

moneyManager.sendMoneyCallback = moneyManager.sendMoneyAction = data => {
	ApiConnector.transferMoney(data, response => {
		if (response.success == true) {
			moneyManager.setMessage(true, "Перевод выполнен успешно");
			ProfileWidget.showProfile(response.data);
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
}

const favoritesWidget = new FavoritesWidget();

function fillFavoritesTable(response) {
	favoritesWidget.clearTable();
	favoritesWidget.fillTable(response.data);
	moneyManager.updateUsersList(response.data);
}

ApiConnector.getFavorites(response => {
	if (response.success == true) {
		fillFavoritesTable(response);
	}
});



favoritesWidget.addUserCallback = FavoritesWidget.getData = data => {
	ApiConnector.addUserToFavorites(data, response => {
		if (response.success == true) {
			fillFavoritesTable(response);
			favoritesWidget.setMessage(true, "Пользователь успешно добавлен");
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	});
}

favoritesWidget.removeUserCallback = FavoritesWidget.getData = data => {
	ApiConnector.removeUserFromFavorites(data, response => {
		if (response.success == true) {
			fillFavoritesTable(response);
			favoritesWidget.setMessage(true, "Пользователь успешно удален");
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	});
}
export default class LoginPage {
    navigateTo = () => cy.visit('http://qa-test.programa.pl/user/login');

    logout = () => cy.get('a[href="/user/logout"]').click();

    get loginInput() {
        return cy.get('#user-email');
    }

    get passwordInput() {
        return cy.get('#user-password');
    }

    submit = () => cy.get('.btn.btn-primary').click();

    get loginValidationLabel() {
        return cy.get('span[data-error-for="user-login-email[email]"]');
    }

    get passwordValidationLabel() {
        return cy.get('span[data-error-for="user-login-email[password]"]');
    }

    get formValidationLabel() {
        return cy.get('div.alert p');
    }

}
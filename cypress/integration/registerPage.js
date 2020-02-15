export default class RegisterPage {
    
    navigateTo = () => cy.visit('http://qa-test.programa.pl/user/register');
    register = () => cy.get('a[href="/user/register"]').click();

    get emailInput() {
        return cy.get('#user-email');
    }

    get passwordInput() {
        return cy.get('input[data-field-name="user-login-email[password][password]"]');
    }

    get repeatPasswordInput() {
        return cy.get('input[data-field-name="user-login-email[password][password_repeat]"]');
    }

    submit = () => cy.get('.btn.btn-primary').click();

    get emailValidationLabel() {
        return cy.get('span[data-error-for="user-login-email[email]"]');
    }

    get passwordValidationLabel() {
        return cy.get('span[data-error-for="user-login-email[password][password]"]');
    }

    get repeatPasswordValidationLabel() {
        return cy.get('span[data-error-for="user-login-email[password][password_repeat]"]');
    }

    get allPasswordValidationLabel() {
        return cy.get('span[data-error-for="user-login-email[password]"]');
    }

    get formValidationLabel() {
        return cy.get('div.alert h2');
    }

}
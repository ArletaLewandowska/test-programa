/// <reference types="Cypress" />

const uuidv4 = require('uuid/v4');


context('Strona Rejestracji', () => {
    beforeEach(() => {
        cy.visit('http://qa-test.programa.pl/user/register')
    })

    afterEach(() =>
        cy.get('a[href="/user/register"]')
            .click()
    )

    context('porawna rejestracja', () => {             

        it('rejestracja z poprawnymi danymi', () => {
            const randomemailpart = uuidv4();

            cy.get('#user-email')
                .type(randomemailpart+'@abc.com').should('have.value', randomemailpart+'@abc.com')
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('bbBB22bb')

            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('equal', 'http://qa-test.programa.pl/registerSuccess');
        })

    })

    context('nieporawna rejestracja', () => {

        it('nie rejestruje się z danymi aktywnego użytkownika', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('bbBB22bb')

            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('div.alert h2').should('have.text', 'Ten adres email jest już zarejestrowany.')
        })

        it('nie rejestruje się wprowadzenia bez danych', () => {
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'To pole jest wymagane')
        })

        it('nie rejestruje się wprowadzenia bez hasła', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'To pole jest wymagane')
        })

        it('nie rejestruje się z błędnym polem "Powtórz nowe hasło"', () => {
            const randomemailpart = uuidv4();
            cy.get('#user-email')
                .type(randomemailpart+'@abc.com').should('have.value', randomemailpart+'@abc.com')
            
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('aaAAaa11')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password]"]').should('have.text', 'Wartości nie sa takie same')
        })


    })
    
})
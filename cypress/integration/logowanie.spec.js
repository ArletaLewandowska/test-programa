/// <reference types="Cypress" />

context('Strona Logowania', () => {
    beforeEach(() => {
        cy.visit('http://qa-test.programa.pl/user/login')
    })

    context('porawne logowanie', () => {

        afterEach(() =>
            cy.get('a[href="/user/logout"]')
                .click()
        )

        it('logowanie z poprawnymi danymi', () => {
            // https://on.cypress.io/type
            cy.get('#user-email')
                .type('yaq90292@zzrgg.com').should('have.value', 'yaq90292@zzrgg.com')
            cy.get('#user-password')
                .type('Aa1aaaaa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('equal', 'http://qa-test.programa.pl/');
        })
    })

    context('niepoprawne logowanie', () => {
        
        it('nie loguje się wprowadzenia bez danych', () => {
            cy.get('#user-email')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password]"]').should('have.text', 'To pole jest wymagane')
        })

        it('nie loguje się błednymi danymi', () => {
            cy.get('#user-email')
                .type('abcdefg@hij.com').should('have.value', 'abcdefg@hij.com')
            cy.get('#user-password')
                .type('Aa1aaaaa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('div.alert p').should('have.text', 'Błędne dane logowania.')
        })

        it('nie loguje zarejestrowanego użytkownika z błednymi hasłem', () => {
            cy.get('#user-email')
                .type('yaq90292@zzrgg.com').should('have.value', 'yaq90292@zzrgg.com')
            cy.get('#user-password')
                .type('aass22dfgf')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('div.alert p').should('have.text', 'Błędne dane logowania.')
        })

    })
}) 
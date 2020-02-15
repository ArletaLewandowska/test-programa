/// <reference types="Cypress" />

import LoginPage from './loginPage';
const loginPage = new LoginPage();

context('Login Page', () => {
    beforeEach( () => {
        loginPage.navigateTo();
        // dodany czas 5s, ponieważ bpojawiał się błąd 429 - "Too Many Request" 
        cy.wait(5000)
    })

    context('valid data', () => {

        afterEach(() =>
            loginPage.logout()
        )

        it ('login with valid data', () => {
            loginPage.loginInput
                .type('yaq90292@zzrgg.com').should('have.value', 'yaq90292@zzrgg.com')
            loginPage.passwordInput
                .type('Aa1aaaaa')
            loginPage.submit();

            cy.url().should('equal', 'http://qa-test.programa.pl/');
        })
    })

    context('invalid data', () => {

        //brak danych
        it ('does not log in without data', () => {
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.loginValidationLabel
                .should('have.text', 'To pole jest wymagane')
            loginPage.passwordValidationLabel
                .should('have.text', 'To pole jest wymagane')
        })

        //błędne dane
        it('does not log in with incorrect data', () => {
            loginPage.loginInput
                .type('asdfghjklqwertyu').should('have.value', 'asdfghjklqwertyu')
            loginPage.passwordInput
                .type('asdfghjklqwertyu')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.loginValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //niezarejestrowany email
        it('does not log in with the data of an unregistered user', () => {
            loginPage.loginInput
                .type('abcdefg@hij.com').should('have.value', 'abcdefg@hij.com')
            loginPage.passwordInput
                .type('Aa1aaaaa')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.formValidationLabel.should('have.text', 'Błędne dane logowania.')
        })

        //email bez weryfikacji
        it('does not log in with the data of the registered user but not verified by the activation link', () => {
            loginPage.loginInput
                .type('aaabbbccc@aaa.bbb').should('have.value', 'aaabbbccc@aaa.bbb')
            loginPage.passwordInput
                .type('aaAAaa11')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.formValidationLabel.should('have.text', 'To konto nie zostało zweryfikowane. Odbierz wiadomość email, aby dokończyć rejestrację.')
        })

        //brak "@" w mailu
        it('nie loguje zaredoes not log in a registered user without "@" in the "Email" field', () => {
            loginPage.loginInput
                .type('yaq90292zzrgg.com').should('have.value', 'yaq90292zzrgg.com')
            loginPage.passwordInput
                .type('Aa1aaaaa')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.loginValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak domeny w mailu
        it('does not log in a registered user without a domain name in the "Email" field', () => {
            loginPage.loginInput
                .type('yaq90292@').should('have.value', 'yaq90292@')
            loginPage.passwordInput
                .type('Aa1aaaaa')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.loginValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak rozszerzenia domeny w mailu
        it('does not log in a registered user without a domain name extension in the "Email" field', () => {
            loginPage.loginInput
                .type('yaq90292@zzrgg').should('have.value', 'yaq90292@zzrgg')
            loginPage.passwordInput
                .type('Aa1aaaaa')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.loginValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak adresy internetowego w mailu
        it('does not log in a registered user without an internet address in the "Email" field', () => {
            loginPage.loginInput
                .type('yaq90292@.com').should('have.value', 'yaq90292@.com')
            loginPage.passwordInput
                .type('Aa1aaaaa')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.loginValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak identyfikatora użytkownika w mailu
        it('does not log in a registered user without a user ID in the "Email" field', () => {
            loginPage.loginInput
                .type('@zzrgg.com').should('have.value', '@zzrgg.com')
            loginPage.passwordInput
                .type('Aa1aaaaa')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.loginValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //błędne hasło
        it('does not log in a registered user with an incorrect password', () => {
            loginPage.loginInput
                .type('yaq90292@zzrgg.com').should('have.value', 'yaq90292@zzrgg.com')
            loginPage.passwordInput
                .type('aass22dfgf')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.formValidationLabel.should('have.text', 'Błędne dane logowania.')
        })

        //brak hasła
        it('does not log in a registered user without a password', () => {
            loginPage.loginInput
                .type('yaq90292@zzrgg.com').should('have.value', 'yaq90292@zzrgg.com')
            loginPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            loginPage.passwordValidationLabel.should('have.text', 'To pole jest wymagane')
        })

    })
}) 
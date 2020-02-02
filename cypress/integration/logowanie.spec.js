/// <reference types="Cypress" />

context('Strona Logowania', () => {
    beforeEach(() => {
        cy.visit('http://qa-test.programa.pl/user/login')
        // dodany czas 5s, ponieważ bpojawiał się błąd 429 - "Too Many Request" 
        cy.wait(5000)
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

        //brak danych
        it('nie loguje się bez wprowadzenia danych', () => {
            cy.get('#user-email')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password]"]').should('have.text', 'To pole jest wymagane')
        })

        //błędne dane
        it('nie loguje się błędnymi danymi', () => {
            cy.get('#user-email')
                .type('asdfghjklqwertyu').should('have.value', 'asdfghjklqwertyu')
            cy.get('#user-password')
                .type('asdfghjklqwertyu')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //niezarejestrowany email
        it('nie loguje się danymi niezarejestrowanego użytkownika', () => {
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

        //email bez weryfikacji
        it('nie loguje się danymi użytkownika zarejestrowanego, ale nie zweryfikowanego linkiem aktywacyjnym', () => {
            cy.get('#user-email')
                .type('aaabbbccc@aaa.bbb').should('have.value', 'aaabbbccc@aaa.bbb')
            cy.get('#user-password')
                .type('aaAAaa11')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('div.alert p').should('have.text', 'To konto nie zostało zweryfikowane. Odbierz wiadomość email, aby dokończyć rejestrację.')
        })

        //brak "@" w mailu
        it('nie loguje zarejestrowanego użytkownika bez "@" w polu "Email"', () => {
            cy.get('#user-email')
                .type('yaq90292zzrgg.com').should('have.value', 'yaq90292zzrgg.com')
            cy.get('#user-password')
                .type('Aa1aaaaa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak domeny w mailu
        it('nie loguje zarejestrowanego użytkownika bez nazwy domeny w polu "Email"', () => {
            cy.get('#user-email')
                .type('yaq90292@').should('have.value', 'yaq90292@')
            cy.get('#user-password')
                .type('Aa1aaaaa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak rozszerzenia domeny w mailu
        it('nie loguje zarejestrowanego użytkownika bez rozszerzenia nazwy domeny w polu "Email"', () => {
            cy.get('#user-email')
                .type('yaq90292@zzrgg').should('have.value', 'yaq90292@zzrgg')
            cy.get('#user-password')
                .type('Aa1aaaaa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak adresy internetowego w mailu
        it('nie loguje zarejestrowanego użytkownika bez adresu internetowego w polu "Email"', () => {
            cy.get('#user-email')
                .type('yaq90292@.com').should('have.value', 'yaq90292@.com')
            cy.get('#user-password')
                .type('Aa1aaaaa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak identyfikatora użytkownika w mailu
        it('nie loguje zarejestrowanego użytkownika bez identyfikatora użytkownika w polu "Email"', () => {
            cy.get('#user-email')
                .type('@zzrgg.com').should('have.value', '@zzrgg.com')
            cy.get('#user-password')
                .type('Aa1aaaaa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //błędne hasło
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

        //brak hasła
        it('nie loguje zarejestrowanego użytkownika bez hasła', () => {
            cy.get('#user-email')
                .type('yaq90292@zzrgg.com').should('have.value', 'yaq90292@zzrgg.com')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/login')
            cy.get('span[data-error-for="user-login-email[password]"]').should('have.text', 'To pole jest wymagane')
        })

    })
}) 
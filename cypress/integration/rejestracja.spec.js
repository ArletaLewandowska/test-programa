/// <reference types="Cypress" />

const uuidv4 = require('uuid/v4');


context('Strona Rejestracji', () => {
    beforeEach(() => {
        cy.visit('http://qa-test.programa.pl/user/register')
        // dodany czas 3s, ponieważ pojawiał się błąd 429 - "Too Many Request" 
        cy.wait(3000)
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

        //dane aktywnego użytkownika
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

        //brak danych
        it('nie rejestruje się bez wprowadzenia danych', () => {
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'To pole jest wymagane')
        })

        //brak "@"
        it('nie rejestruje się bez wprowadzenia prawidlowego maila - brak znaku "@"', () => {
            cy.get('#user-email')
                .type('abcdefghijk.com').should('have.value', 'abcdefghijk.com')
                cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('bbBB22bb')

            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak domeny
        it('nie rejestruje się bez wprowadzenia prawidlowego maila - brak nazwy domeny', () => {
            cy.get('#user-email')
                .type('abcdefg@').should('have.value', 'abcdefg@')
                cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('bbBB22bb')

            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak rozszerzenia domeny
        it('nie rejestruje się bez wprowadzenia prawidlowego maila - brak rozszerzenia nazwy domeny', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk').should('have.value', 'abcdefg@hijk')
                cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('bbBB22bb')

            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak adresu internetowego
        it('nie rejestruje się bez wprowadzenia prawidlowego maila - brak adresu internetowego domeny', () => {
            cy.get('#user-email')
                .type('abcdefg@.com').should('have.value', 'abcdefg@.com')
                cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('bbBB22bb')

            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak identyfikatora użytkownika
        it('nie rejestruje się bez wprowadzenia prawidlowego maila - brak identyfikatora użytkownika', () => {
            cy.get('#user-email')
                .type('@hijk.com').should('have.value', '@hijk.com')
                cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('bbBB22bb')

            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[email]"]').should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak hasła
        it('nie rejestruje się bez wprowadzenia hasła', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'To pole jest wymagane')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'To pole jest wymagane')
        })

        //brak potwierdzenia hasła
        it('nie rejestruje się bez wprowadzenia hasła w pole "Powtórz nowe hasło"', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('bbBB22bb')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'To pole jest wymagane')
        })

        //błędne potwierdzenie hasła
        it('nie rejestruje się z błędnym polem "Powtórz nowe hasło"', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')      
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

        //hasło za długie
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        it('nie rejestruje się z hasłem niezgodnym z walidacją długości pola - powyżej 255 znaków', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')  
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('TVLDteES6SJcwM3zUzJoKT36HujrE7RYt33mG8CdqMQnYhmkhu7tMzXVtFLyc4W6vpRCWUfL7wywdkfUeLMsLbNEgZCTtYpoNEraY6nw2msE58ZJkdAvNNzudBM62BTeGJP6fB3GnULRscZbPZ73e6WR8aozbFdhQtNwugCfAPwtrW4FnA9Z6vhD65CFbgpr9Cn4jqJkEFcv3FANFaec5VfzqjF2YvSyxD3gubZygCuHHvVN5AqzV6zLNEcdAucy')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('TVLDteES6SJcwM3zUzJoKT36HujrE7RYt33mG8CdqMQnYhmkhu7tMzXVtFLyc4W6vpRCWUfL7wywdkfUeLMsLbNEgZCTtYpoNEraY6nw2msE58ZJkdAvNNzudBM62BTeGJP6fB3GnULRscZbPZ73e6WR8aozbFdhQtNwugCfAPwtrW4FnA9Z6vhD65CFbgpr9Cn4jqJkEFcv3FANFaec5VfzqjF2YvSyxD3gubZygCuHHvVN5AqzV6zLNEcdAucy')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'Ilość znaków powinna zawierać się między 8 a 255')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'Ilość znaków powinna zawierać się między 8 a 255')
         
        })

        //hasło za krótkie
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        //błąd - nieprawidłowy komunikat walidacji - oczekiwany text pola span "Ilość znaków powinna zawierać się między 8 a 255" w polach "Hasło" i "Powtórz nowe hasło"
        //wykonać test, który się nie wykona ze względu na prawidłową wartość 'have.text'
        it('nie rejestruje się z hasłem niezgodnym z walidacją długości pola - poniżej 8 znaków', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')       
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('aa')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('aa')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
        })

        //hasło - brak wielkiej litery
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        it('nie rejestruje się z hasłem niezgodnym z walidacją - brak wielkiej litery', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('aaaaaa11')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('aaaaaa11')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')             
        })

        //hasło - brak małej litery
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        it('nie rejestruje się z hasłem niezgodnym z walidacją - brak małej litery', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('AAAAAA11')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('AAAAAA11')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')             
        })

        //hasło - brak znaku specjalnego lub cyfry
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        //błąd - nieprawidłowy komunikat walidacji - oczekiwany text pola span "Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny lub cyfrę."
        //wykonać test, który się nie wykona ze względu na prawidłową wartość 'have.text'
        it('nie rejestruje się z hasłem niezgodnym z walidacją - brak cyfry lub znaku specjalnego', () => {
            cy.get('#user-email')
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            cy.get('input[data-field-name="user-login-email[password][password]"]')
                .type('aaaaaaAA')
            cy.get('input[data-field-name="user-login-email[password][password_repeat]"]')
                .type('aaaaaaAA')
            cy.get('.btn.btn-primary')
                .click()

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            cy.get('span[data-error-for="user-login-email[password][password]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            cy.get('span[data-error-for="user-login-email[password][password_repeat]"]').should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')             
        })
    })
    
})
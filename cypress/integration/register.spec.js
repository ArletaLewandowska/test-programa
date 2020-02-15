/// <reference types="Cypress" />

import RegisterPage from './registerPage';
const registerPage = new RegisterPage();

const uuidv4 = require('uuid/v4');


context('Register Page', () => {
    beforeEach(() => {
        registerPage.navigateTo();
        // dodany czas 3s, ponieważ pojawiał się błąd 429 - "Too Many Request" 
        cy.wait(3000)
    })

    afterEach(() =>
        registerPage.register()
    )

    context('valid data', () => {             

        it('registration with valid data', () => {
            const randomemailpart = uuidv4();

            registerPage.emailInput
                .type(randomemailpart+'@abc.com').should('have.value', randomemailpart+'@abc.com')
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('bbBB22bb')

            registerPage.submit();

            cy.url().should('equal', 'http://qa-test.programa.pl/registerSuccess');
        })

    })

    context('nieporawna rejestracja', () => {

        //dane aktywnego użytkownika
        it('does not register with the active user data', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('bbBB22bb')

            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.formValidationLabel.should('have.text', 'Ten adres email jest już zarejestrowany.')
        })

        //brak danych
        it('does not register without data', () => {
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.emailValidationLabel.should('have.text', 'To pole jest wymagane')
            registerPage.passwordValidationLabel.should('have.text', 'To pole jest wymagane')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'To pole jest wymagane')
        })

        //brak "@"
        it('does not register without a valid email - no "@"', () => {
            registerPage.emailInput
                .type('abcdefghijk.com').should('have.value', 'abcdefghijk.com')
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('bbBB22bb')

            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.emailValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak domeny
        it('does not register without a valid email - no domain name', () => {
            registerPage.emailInput
                .type('abcdefg@').should('have.value', 'abcdefg@')
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('bbBB22bb')

            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.emailValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak rozszerzenia domeny
        it('does not register without a valid email - no domain name extension', () => {
            registerPage.emailInput
                .type('abcdefg@hijk').should('have.value', 'abcdefg@hijk')
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('bbBB22bb')

            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.emailValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak adresu internetowego
        it('does not register without a valid email - no domain internet address', () => {
            registerPage.emailInput
                .type('abcdefg@.com').should('have.value', 'abcdefg@.com')
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('bbBB22bb')

            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.emailValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak identyfikatora użytkownika
        it('does not register without a valid email - no user ID', () => {
            registerPage.emailInput
                .type('@hijk.com').should('have.value', '@hijk.com')
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('bbBB22bb')

            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.emailValidationLabel.should('have.text', 'Nieprawidłowy adres e-mail')
        })

        //brak hasła
        it('does not register without a password', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.passwordValidationLabel.should('have.text', 'To pole jest wymagane')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'To pole jest wymagane')
        })

        //brak potwierdzenia hasła
        it('does not register without repeating the password', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            registerPage.passwordInput
                .type('bbBB22bb')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'To pole jest wymagane')
        })

        //błędne potwierdzenie hasła
        it('does not register with an incorrect repeated password', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')      
            registerPage.passwordInput
                .type('bbBB22bb')
            registerPage.repeatPasswordInput
                .type('aaAAaa11')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.allPasswordValidationLabel.should('have.text', 'Wartości nie sa takie same')
        })

        //hasło za długie
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        it('does not register with a password that is not valid - more than 255 characters', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')  
            registerPage.passwordInput
                .type('TVLDteES6SJcwM3zUzJoKT36HujrE7RYt33mG8CdqMQnYhmkhu7tMzXVtFLyc4W6vpRCWUfL7wywdkfUeLMsLbNEgZCTtYpoNEraY6nw2msE58ZJkdAvNNzudBM62BTeGJP6fB3GnULRscZbPZ73e6WR8aozbFdhQtNwugCfAPwtrW4FnA9Z6vhD65CFbgpr9Cn4jqJkEFcv3FANFaec5VfzqjF2YvSyxD3gubZygCuHHvVN5AqzV6zLNEcdAucy')
            registerPage.repeatPasswordInput
                .type('TVLDteES6SJcwM3zUzJoKT36HujrE7RYt33mG8CdqMQnYhmkhu7tMzXVtFLyc4W6vpRCWUfL7wywdkfUeLMsLbNEgZCTtYpoNEraY6nw2msE58ZJkdAvNNzudBM62BTeGJP6fB3GnULRscZbPZ73e6WR8aozbFdhQtNwugCfAPwtrW4FnA9Z6vhD65CFbgpr9Cn4jqJkEFcv3FANFaec5VfzqjF2YvSyxD3gubZygCuHHvVN5AqzV6zLNEcdAucy')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.passwordValidationLabel.should('have.text', 'Ilość znaków powinna zawierać się między 8 a 255')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'Ilość znaków powinna zawierać się między 8 a 255')
         
        })

        //hasło za krótkie
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        //błąd - nieprawidłowy komunikat walidacji - oczekiwany text pola span "Ilość znaków powinna zawierać się między 8 a 255" w polach "Hasło" i "Powtórz nowe hasło"
        //wykonać test, który się nie wykona ze względu na prawidłową wartość 'have.text'
        it('does not register with a password that is not valid - less than 8 characters', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')       
            registerPage.passwordInput
                .type('aa')
            registerPage.repeatPasswordInput
                .type('aa')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.passwordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
        })

        //hasło - brak wielkiej litery
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        it('does not register with a password that is not valid - no uppercase letter', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            registerPage.passwordInput
                .type('aaaaaa11')
            registerPage.repeatPasswordInput
                .type('aaaaaa11')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.passwordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')             
        })

        //hasło - brak małej litery
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        it('does not register with a password that is not valid - no lowercase letter', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            registerPage.passwordInput
                .type('AAAAAA11')
            registerPage.repeatPasswordInput
                .type('AAAAAA11')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.passwordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')             
        })

        //hasło - brak znaku specjalnego lub cyfry
        //bez powtarzania hasła -  'have.text', 'To pole jest wymagane'
        //błąd - nieprawidłowy komunikat walidacji - oczekiwany text pola span "Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny lub cyfrę."
        //wykonać test, który się nie wykona ze względu na prawidłową wartość 'have.text'
        it('does not register with a password that is not valid - no number or special character', () => {
            registerPage.emailInput
                .type('abcdefg@hijk.com').should('have.value', 'abcdefg@hijk.com')
            registerPage.passwordInput
                .type('aaaaaaAA')
            registerPage.repeatPasswordInput
                .type('aaaaaaAA')
            
            registerPage.submit();

            cy.url().should('not.equal', 'http://qa-test.programa.pl/registerSuccess')
            cy.url().should('equal', 'http://qa-test.programa.pl/user/register')
            registerPage.passwordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')
            registerPage.repeatPasswordValidationLabel.should('have.text', 'Hasło musi zawierać przynajmniej jedną wielką, jedną małą literę oraz jeden znak specjalny.')             
        })
    })
    
})
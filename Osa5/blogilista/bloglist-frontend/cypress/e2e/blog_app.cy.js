describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Jhon Doe',
      username: 'JD222',
      password: 'root'
    }
    const user2 = {
      name: 'Ford',
      username: 'Ford',
      password: 'root'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains ('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('JD222')
      cy.get('#password').type('root')
      cy.get('#login-button').click()
      cy.contains('Logged in as Jhon Doe')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('J222')
      cy.get('#password').type('rot')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'JD222', password: 'root' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('newblog')
      cy.get('#author').type('authorblog')
      cy.get('#url').type('urlblog')
      cy.get('#newBlog-button').click()
      cy.contains('added newblog')
      cy.contains('newblog authorblog')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title: 'New blog', author: 'JD', url: 'Http://google.com' })
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
      cy.contains('like').click()
      cy.contains('2')
    })

    it('A blog can be removed', function() {
      cy.createBlog({ title: 'New blog', author: 'JD', url: 'Http://google.com' })
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('New blog JD').should('not.exist')
    })

    it('Only creator of blog sees remove button', function() {
      cy.createBlog({ title: 'New blog', author: 'JD', url: 'Http://google.com' })
      cy.contains('view').click()
      cy.contains('remove')
      cy.contains('log out').click()
      cy.login({ username:'Ford', password:'root' })
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })
  })

})
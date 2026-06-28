const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Chapter & Verse API',
    version: '1.0.0',
    description: 'REST API for the Chapter & Verse book management system',
  },
  servers: [
    { url: process.env.SERVER_URL, description: 'Production' },
    { url: 'http://localhost:5000', description: 'Local' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter the JWT token you received from /login',
      },
    },
    schemas: {
      // ─── Reusable response shapes ───────────────────────────────────────────
      SuccessMessage: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful.' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Something went wrong.' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful.' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/User' },
        },
      },

      // ─── Data models ────────────────────────────────────────────────────────
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e1' },
          name: { type: 'string', example: 'Aniqa Rahman' },
          email: { type: 'string', example: 'aniqa@example.com' },
          phoneNumber: { type: 'string', example: '01700000000' },
          address: { type: 'string', example: 'Dhaka' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          provider: { type: 'string', enum: ['local', 'google'], example: 'local' },
          isVerified: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Book: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e1' },
          bookName: { type: 'string', example: 'The Alchemist' },
          bookImage: { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/alchemist.jpg' },
          authorName: { type: 'string', example: 'Paulo Coelho' },
          publisherName: { type: 'string', example: 'HarperCollins' },
          price: { type: 'number', example: 15.99 },
          category: { type: 'string', example: 'Fiction' },
          dateOfArrival: { type: 'string', format: 'date', example: '2024-01-15' },
          availableCopies: { type: 'integer', example: 50 },
          soldCopies: { type: 'integer', example: 120 },
          description: { type: 'string', example: 'A novel about following your dreams.' },
          numberOfPages: { type: 'integer', example: 208 },
        },
      },
      Author: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e1' },
          name: { type: 'string', example: 'Paulo Coelho' },
          email: { type: 'string', example: 'paulo@example.com' },
          phone: { type: 'string', example: '01800000000' },
          desciption: { type: 'string', example: 'Brazilian author known for The Alchemist.' },
        },
      },
      AuthorInput: {
        type: 'object',
        required: ['name', 'email', 'phone', 'desciption'],
        properties: {
          name: { type: 'string', example: 'Paulo Coelho' },
          email: { type: 'string', example: 'paulo@example.com' },
          phone: { type: 'string', example: '01800000000' },
          desciption: { type: 'string', example: 'Brazilian author known for The Alchemist.' },
        },
      },
      Publisher: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e1' },
          name: { type: 'string', example: 'HarperCollins' },
          email: { type: 'string', example: 'contact@harpercollins.com' },
          phone: { type: 'string', example: '01900000000' },
          desciption: { type: 'string', example: 'One of the largest publishing companies.' },
        },
      },
      PublisherInput: {
        type: 'object',
        required: ['name', 'email', 'phone', 'desciption'],
        properties: {
          name: { type: 'string', example: 'HarperCollins' },
          email: { type: 'string', example: 'contact@harpercollins.com' },
          phone: { type: 'string', example: '01900000000' },
          desciption: { type: 'string', example: 'One of the largest publishing companies.' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e1' },
          name: { type: 'string', example: 'Fiction' },
          image: { type: 'string', example: 'https://example.com/fiction.jpg' },
          desciption: { type: 'string', example: 'Fictional story books.' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e1' },
          userId: { type: 'string', nullable: true, example: '64b1f2c3d4e5f6a7b8c9d0e2' },
          books: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                bookId: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e3' },
                bookName: { type: 'string', example: 'The Alchemist' },
                quantity: { type: 'integer', example: 2 },
                price: { type: 'number', example: 15.99 },
              },
            },
          },
          totalAmount: { type: 'number', example: 31.98 },
          orderStatus: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], example: 'pending' },
          paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'], example: 'pending' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Registration, login, and email verification' },
    { name: 'Users', description: 'User management' },
    { name: 'Books', description: 'Book catalog and management' },
    { name: 'Authors', description: 'Author management' },
    { name: 'Publishers', description: 'Publisher management' },
    { name: 'Categories', description: 'Book categories' },
    { name: 'Orders', description: 'Order placement and management' },
  ],
  paths: {
    // ─── Auth ──────────────────────────────────────────────────────────────────
    '/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'phoneNumber', 'address'],
                properties: {
                  name: { type: 'string', example: 'Aniqa Rahman' },
                  email: { type: 'string', example: 'aniqa@example.com' },
                  password: { type: 'string', example: 'securepassword123' },
                  phoneNumber: { type: 'string', example: '01700000000' },
                  address: { type: 'string', example: 'Dhaka' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registered successfully. Verification email sent.', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          409: { description: 'Email already registered.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Server error.' },
        },
      },
    },
    '/resend-verification': {
      post: {
        tags: ['Auth'],
        summary: 'Resend email verification link',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', example: 'aniqa@example.com' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Verification email resent.', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          400: { description: 'Account already verified.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'No account found with this email.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Server error.' },
        },
      },
    },
    '/verify-email/{token}': {
      get: {
        tags: ['Auth'],
        summary: 'Verify email using the token sent to inbox',
        parameters: [{ in: 'path', name: 'token', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Email verified successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          400: { description: 'Invalid or expired token.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Server error.' },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'aniqa@example.com' },
                  password: { type: 'string', example: 'securepassword123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful.', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { description: 'Invalid email or password.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Email not verified or Google-only account.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Server error.' },
        },
      },
    },
    '/auth/google': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in with Google',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token'],
                properties: {
                  token: { type: 'string', description: 'Google ID token from the frontend OAuth flow', example: 'eyJhbGci...' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Google sign-in successful.', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { description: 'Invalid Google token.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Email already registered with credentials.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and invalidate the current token',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Logged out successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Silent login — verify stored token and receive a fresh one',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Token refreshed.', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { description: 'Token expired or invalid.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ─── Users ─────────────────────────────────────────────────────────────────
    '/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current logged-in user profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Current user.', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'User not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users (admin only)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of all users.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/make-admin/{id}': {
      patch: {
        tags: ['Users'],
        summary: 'Grant admin role to a user (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'User is now an admin.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'User is now an admin.' }, data: { $ref: '#/components/schemas/User' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'User not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/remove-admin/{id}': {
      patch: {
        tags: ['Users'],
        summary: 'Remove admin role from a user (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Admin role removed.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Admin role removed successfully.' }, data: { $ref: '#/components/schemas/User' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'User not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ─── Books ─────────────────────────────────────────────────────────────────
    '/books': {
      get: {
        tags: ['Books'],
        summary: 'Get all books',
        responses: {
          200: { description: 'List of all books.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
        },
      },
    },
    '/featured-books': {
      get: {
        tags: ['Books'],
        summary: 'Get top 5 featured books (sorted by name)',
        responses: {
          200: { description: 'Featured books.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
        },
      },
    },
    '/best-selling': {
      get: {
        tags: ['Books'],
        summary: 'Get top 5 best-selling books (sorted by soldCopies)',
        responses: {
          200: { description: 'Best-selling books.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
        },
      },
    },
    '/new-arrivals': {
      get: {
        tags: ['Books'],
        summary: 'Get top 5 newest books (sorted by dateOfArrival)',
        responses: {
          200: { description: 'New arrivals.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
        },
      },
    },
    '/search-books/{bookName}': {
      get: {
        tags: ['Books'],
        summary: 'Search books by name (case-insensitive)',
        parameters: [{ in: 'path', name: 'bookName', required: true, schema: { type: 'string' }, example: 'alchemist' }],
        responses: {
          200: { description: 'Matching books.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
        },
      },
    },
    '/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Get a single book by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, example: '64b1f2c3d4e5f6a7b8c9d0e1' }],
        responses: {
          200: { description: 'Book details.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
          404: { description: 'Book not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/books-by-author/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Get all books by author ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, example: '64b1f2c3d4e5f6a7b8c9d0e1' }],
        responses: {
          200: { description: 'Books by author.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
          404: { description: 'Author not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/books-by-publisher/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Get all books by publisher ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, example: '64b1f2c3d4e5f6a7b8c9d0e1' }],
        responses: {
          200: { description: 'Books by publisher.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
          404: { description: 'Publisher not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/books-by-category/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Get all books by category ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, example: '64b1f2c3d4e5f6a7b8c9d0e1' }],
        responses: {
          200: { description: 'Books by category.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
          404: { description: 'Category not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/add-books': {
      post: {
        tags: ['Books'],
        summary: 'Add a new book (admin only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['bookName', 'authorName', 'publisherName', 'price', 'category', 'dateOfArrival', 'availableCopies', 'soldCopies', 'description', 'numberOfPages'],
                properties: {
                  bookImage: { type: 'string', format: 'binary', description: 'Book cover image file' },
                  bookName: { type: 'string', example: 'The Alchemist' },
                  authorName: { type: 'string', example: 'Paulo Coelho' },
                  publisherName: { type: 'string', example: 'HarperCollins' },
                  price: { type: 'number', example: 15.99 },
                  category: { type: 'string', example: 'Fiction' },
                  dateOfArrival: { type: 'string', format: 'date', example: '2024-01-15' },
                  availableCopies: { type: 'integer', example: 50 },
                  soldCopies: { type: 'integer', example: 0 },
                  description: { type: 'string', example: 'A novel about following your dreams.' },
                  numberOfPages: { type: 'integer', example: 208 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Book added successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Book added successfully.' }, data: { $ref: '#/components/schemas/Book' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/update-book/{id}': {
      put: {
        tags: ['Books'],
        summary: 'Update a book by ID (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  bookImage: { type: 'string', format: 'binary', description: 'New book cover image (optional)' },
                  bookName: { type: 'string', example: 'The Alchemist' },
                  authorName: { type: 'string', example: 'Paulo Coelho' },
                  publisherName: { type: 'string', example: 'HarperCollins' },
                  price: { type: 'number', example: 15.99 },
                  category: { type: 'string', example: 'Fiction' },
                  dateOfArrival: { type: 'string', format: 'date', example: '2024-01-15' },
                  availableCopies: { type: 'integer', example: 50 },
                  soldCopies: { type: 'integer', example: 0 },
                  description: { type: 'string', example: 'A novel about following your dreams.' },
                  numberOfPages: { type: 'integer', example: 208 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Book updated successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Book updated successfully.' }, data: { $ref: '#/components/schemas/Book' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/delete-book/{id}': {
      delete: {
        tags: ['Books'],
        summary: 'Delete a book by ID (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Book deleted successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Book not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ─── Authors ───────────────────────────────────────────────────────────────
    '/authors': {
      get: {
        tags: ['Authors'],
        summary: 'Get all authors',
        responses: {
          200: { description: 'List of all authors.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Author' } } } } },
        },
      },
    },
    '/authors/{id}': {
      get: {
        tags: ['Authors'],
        summary: 'Get a single author by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Author details.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Author' } } } },
          404: { description: 'Author not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/add-authors': {
      post: {
        tags: ['Authors'],
        summary: 'Add a new author (admin only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthorInput' } } },
        },
        responses: {
          201: {
            description: 'Author added successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Author added successfully.' }, data: { $ref: '#/components/schemas/Author' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/update-author/{id}': {
      put: {
        tags: ['Authors'],
        summary: 'Update an author by ID (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthorInput' } } },
        },
        responses: {
          200: {
            description: 'Author updated successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Author updated successfully.' }, data: { $ref: '#/components/schemas/Author' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/delete-author/{id}': {
      delete: {
        tags: ['Authors'],
        summary: 'Delete an author by ID (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Author deleted successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Author not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ─── Publishers ────────────────────────────────────────────────────────────
    '/publishers': {
      get: {
        tags: ['Publishers'],
        summary: 'Get all publishers',
        responses: {
          200: { description: 'List of all publishers.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Publisher' } } } } },
        },
      },
    },
    '/publishers/{id}': {
      get: {
        tags: ['Publishers'],
        summary: 'Get a single publisher by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Publisher details.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Publisher' } } } },
          404: { description: 'Publisher not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/add-publishers': {
      post: {
        tags: ['Publishers'],
        summary: 'Add a new publisher (admin only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PublisherInput' } } },
        },
        responses: {
          201: {
            description: 'Publisher added successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Publisher added successfully.' }, data: { $ref: '#/components/schemas/Publisher' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/update-publisher/{id}': {
      put: {
        tags: ['Publishers'],
        summary: 'Update a publisher by ID (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PublisherInput' } } },
        },
        responses: {
          200: {
            description: 'Publisher updated successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Publisher updated successfully.' }, data: { $ref: '#/components/schemas/Publisher' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/delete-publisher/{id}': {
      delete: {
        tags: ['Publishers'],
        summary: 'Delete a publisher by ID (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Publisher deleted successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Publisher not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    // ─── Categories ────────────────────────────────────────────────────────────
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories',
        responses: {
          200: { description: 'List of all categories.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } },
        },
      },
    },
    '/names-of-categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get only category IDs and names',
        responses: {
          200: {
            description: 'Category names.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string' },
                      name: { type: 'string', example: 'Fiction' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ─── Orders ────────────────────────────────────────────────────────────────
    '/place-order': {
      post: {
        tags: ['Orders'],
        summary: 'Place a new order (public — token optional, links order to account if provided)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['books'],
                properties: {
                  books: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['bookId', 'quantity'],
                      properties: {
                        bookId: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e3' },
                        quantity: { type: 'integer', example: 2 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Order placed successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Order placed successfully.' }, data: { $ref: '#/components/schemas/Order' } } } } },
          },
          404: { description: 'Book not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/my-orders': {
      get: {
        tags: ['Orders'],
        summary: "Get the logged-in user's orders",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "User's orders.", content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders (admin only)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'All orders.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/order-status/{id}': {
      patch: {
        tags: ['Orders'],
        summary: 'Update order status (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderStatus'],
                properties: {
                  orderStatus: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order status updated successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Order status updated successfully.' }, data: { $ref: '#/components/schemas/Order' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Order not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/payment-status/{id}': {
      patch: {
        tags: ['Orders'],
        summary: 'Update payment status (admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['paymentStatus'],
                properties: {
                  paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Payment status updated successfully.',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Payment status updated successfully.' }, data: { $ref: '#/components/schemas/Order' } } } } },
          },
          401: { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Admin access required.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Order not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};

module.exports = swaggerSpec;

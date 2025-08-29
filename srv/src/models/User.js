// models/User.js
export class User {
    constructor({ id = null, identifier, email, password, age, session = null }) {
        this.id = id;
        this.identifier = identifier;
        this.password = password;
        this.email = email
        this.age = age;
        this.session = session;
    }

    async validatePassword(password, bcrypt) {
        return bcrypt.compare(password, this.password);
    }

    toViewModel() {
        return {
            id: this.id,
            identifier: this.identifier,
            age: this.age,
            email: this.email,
            session: this.session ? { createdAt: this.session.createdAt } : null
        };
    }
}

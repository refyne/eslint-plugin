# no-unused-dependency-injection

Detect unused dependency injections in class constructors

## Rule Details

This rule identifies constructor parameters that are injected as dependencies but never used in the class. It helps maintain clean code by flagging unused dependencies that should be removed.

## Options

None.

### Valid

```ts
class UserService {
    constructor(private userRepository: UserRepository) {}

    getUser(id: string) {
        return this.userRepository.findById(id);
    }
}
```

```ts
class OrderService {
    constructor(
        private orderRepository: OrderRepository,
        private emailService: EmailService,
    ) {}

    createOrder(order: Order) {
        const savedOrder = this.orderRepository.save(order);
        this.emailService.sendConfirmation(savedOrder);
        return savedOrder;
    }
}
```

### Invalid

```ts
class UserService {
    constructor(
        private userRepository: UserRepository,
        private logger: Logger, // Logger is injected but never used
    ) {}

    getUser(id: string) {
        return this.userRepository.findById(id);
    }
}
```

```ts
class PaymentService {
    constructor(
        private paymentGateway: PaymentGateway,
        private notificationService: NotificationService, // Unused
    ) {}

    processPayment(amount: number) {
        return this.paymentGateway.charge(amount);
    }
}
```

## When Not To Use It

If you intentionally want to keep unused dependencies in your constructors (for example, for future use or as part of a plugin interface), you may want to disable this rule.

## Further Reading

-   [Dependency Injection Pattern](https://en.wikipedia.org/wiki/Dependency_injection)
-   [NestJS Dependency Injection](https://docs.nestjs.com/providers)

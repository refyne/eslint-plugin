# @refyne/inconsistent-mongoose-type-declaration

Enforce strict required type matching between mongoose and typescript

## Rule Details

This rule aimed at detecting inconsistent mongoose field required type declaration in schema as nethier typescript or mongoose complains about it.

### Valid

```ts
class User {
    @Prop({ required: true })
    userId: string;
}
```

### Invalid

```ts
class User {
    @Prop({ required: true })
    userId?: string; // userId is optional but required in mongoose
}
```

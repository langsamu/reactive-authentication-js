// TODO: Use Web Lock API instead?
export class Mutex {
    #current = Promise.resolve()

    /**
     * Acquires the lock.
     *
     * @example With a `using` declaration
     * const mutex = new Mutex()
     *
     * function f() {
     *   using _ = await mutex.acquire()
     *
     *   // critical section
     * }
     *
     * @remarks
     * The mutex is released only when the returned object is disposed, otherwise the lock is held forever.
     *
     * @return {Promise<Disposable>} An object that can be used to release the lock.
     */
    // TODO: Abort signal?
    async acquire(): Promise<Disposable> {
        const {promise: next, resolve: release} = Promise.withResolvers<void>()

        // Insert a new link in the chain
        const previous = this.#current
        this.#current = next

        // Latch on to the chain
        await previous

        // Provide a way to unhook this link
        return {[Symbol.dispose]: release}
    }
}

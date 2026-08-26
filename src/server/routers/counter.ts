import { db } from "@/prisma/db";

/**
 * Identifier of the singleton counter row.
 *
 * The counter is app-wide, so it lives in a single row with a stable id rather
 * than relying on "the first row we happen to find".
 */
const COUNTER_ID = "app";

/** Read the current counter value, treating a missing row as zero. */
export async function getCounter() {
  const counter = await db.orm.public.Counter.select("value").first({
    id: COUNTER_ID,
  });

  return counter?.value ?? 0;
}

/**
 * Increment the counter and return its new value.
 *
 * The read and the write share a transaction so two concurrent requests cannot
 * both read the same value and write the same increment.
 */
export async function incrementCounter() {
  return db.transaction(async (tx) => {
    const counter = await tx.orm.public.Counter.select("value").first({
      id: COUNTER_ID,
    });

    if (!counter) {
      const created = await tx.orm.public.Counter.select("value").create({
        id: COUNTER_ID,
        value: 1,
      });

      return created.value;
    }

    const updated = await tx.orm.public.Counter.where({ id: COUNTER_ID })
      .select("value")
      .update({ value: counter.value + 1 });

    return updated?.value ?? counter.value + 1;
  });
}

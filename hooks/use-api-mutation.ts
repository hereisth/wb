import { useState } from "react";
import { useMutation } from "convex/react";
import { FunctionReference } from "convex/server";

export const useApiMutation = (mutationFunction: FunctionReference<"mutation">) => {

  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = async (payload: unknown) => {
    setPending(true);
    try {
      const res = await apiMutation(payload);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setPending(false);
    }
  };

  return {
    mutate,
    pending,
  };
};
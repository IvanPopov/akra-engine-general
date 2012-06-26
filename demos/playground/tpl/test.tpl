{namespace examples.simple}

/**
 * Greets a person using "Hello" by default.
 * @param name The name of the person.
 * @param? greetingWord Optional greeting word to use instead of "Hello".
 */
{template .helloName}
  {if not $greetingWord}
    <h1>Hello {$name}!</h1>
  {else}
    {$greetingWord} {$name}!
  {/if}
{/template}
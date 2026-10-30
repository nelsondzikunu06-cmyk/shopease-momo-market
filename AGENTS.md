<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Cloud boundary
- Keep cloud configuration/client/read adapters separate from the local ledger and store; this prevents accidental uploads, tenant merging, or demo roles authorizing cloud actions.
- Cloud adapters are unconnected read-only scaffolding until authentication, controlled owner provisioning, and invitation safety are verified; unsafe live RPCs must never be exposed by UI.
- Use only public browser environment configuration in the lazy browser cloud adapter and generated database types; never import privileged clients into UI.

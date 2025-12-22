CREATE POLICY "View family" ON "families" AS PERMISSIVE FOR SELECT TO public USING (((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.family_id = families.id))))));--> statement-breakpoint
CREATE POLICY "Update family" ON "families" AS PERMISSIVE FOR UPDATE TO public USING ((created_by = auth.uid()));--> statement-breakpoint
CREATE POLICY "Delete family" ON "families" AS PERMISSIVE FOR DELETE TO public USING ((created_by = auth.uid()));--> statement-breakpoint
ALTER POLICY "View own profile" ON "profiles" TO public USING ((id = auth.uid()));
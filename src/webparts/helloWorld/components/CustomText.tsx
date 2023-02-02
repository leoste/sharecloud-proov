import { Stack, Text } from "office-ui-fabric-react"
import * as React from "react"

/**
 * A custom text wrapper, which center-aligns text.
 */
const CustomText: React.FC = ({
  children
}) => {
  return (
    <Stack horizontalAlign='center'>
      <Text>
        {children}
      </Text>
    </Stack>
  )
}

export default CustomText;